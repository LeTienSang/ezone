import React, { useEffect, useState } from 'react';
import { Upload, CreditCard, Clock, AlertCircle, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

interface PendingEnrollment {
  id: number;
  courseName: string;
  price: number;
}

interface PaymentFromAPI {
  id: number;
  enrollment: {
    id: number;
    course: {
      id: number;
      courseName: string;
    };
  };
  amount: number;
  paymentMethod: string;
  transactionId: string;
  proofUrl: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentDate: string;
}

export const StudentPaymentPage: React.FC = () => {
  const [pending, setPending] = useState<PendingEnrollment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản ngân hàng');
  const [transactionId, setTransactionId] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [history, setHistory] = useState<PaymentFromAPI[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchPaymentHistory = async () => {
    try {
      const res = await api.get<PaymentFromAPI[]>('/api/v1/payments/my');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to load payment history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchPendingEnrollment = async () => {
    try {
      const res = await api.get<any[]>('/api/v1/enrollments/my?status=PENDING');
      if (res.data && res.data.length > 0) {
        const latest = res.data[0];
        setPending({
          id: latest.id,
          courseName: latest.course?.courseName || '',
          price: latest.course?.price || 0
        });
      } else {
        setPending(null);
        localStorage.removeItem('pendingEnrollment');
      }
    } catch (err) {
      console.error('Failed to load pending enrollment from backend:', err);
    }
  };

  useEffect(() => {
    // Load pending enrollment from localStorage for faster initial render
    const savedPending = localStorage.getItem('pendingEnrollment');
    if (savedPending) {
      try {
        setPending(JSON.parse(savedPending));
      } catch (e) {
        console.error(e);
      }
    }

    fetchPendingEnrollment();

    // Load payment history from API
    fetchPaymentHistory();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending) return;
    if (!transactionId.trim()) {
      setErrorMsg('Vui lòng nhập Mã giao dịch.');
      return;
    }
    if (!receiptFile) {
      setErrorMsg('Vui lòng đính kèm Ảnh biên lai / Minh chứng chuyển khoản.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('enrollmentId', pending.id.toString());
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionId', transactionId);
      formData.append('receiptImage', receiptFile);

      await api.postForm('/api/v1/payments', formData);
      
      setSuccessMsg('Gửi minh chứng thanh toán thành công! Vui lòng chờ Ban quản trị phê duyệt.');
      
      // Clear pending
      localStorage.removeItem('pendingEnrollment');
      setPending(null);
      setTransactionId('');
      setReceiptFile(null);

      // Refresh payment history from API
      await fetchPaymentHistory();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gửi minh chứng thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center justify-center gap-1 text-yellow-600 bg-yellow-100 border border-yellow-200 px-2 py-1 rounded text-xs font-semibold uppercase w-fit mx-auto">
            <Clock size={14} /> Chờ duyệt
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="flex items-center justify-center gap-1 text-green-600 bg-green-100 border border-green-200 px-2 py-1 rounded text-xs font-semibold uppercase w-fit mx-auto">
            <CheckCircle size={14} /> Đã duyệt
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center justify-center gap-1 text-red-600 bg-red-100 border border-red-200 px-2 py-1 rounded text-xs font-semibold uppercase w-fit mx-auto">
            <XCircle size={14} /> Từ chối
          </span>
        );
      default:
        return <span className="text-xs text-gray-500">{status}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Thanh toán học phí</h1>
        <p className="text-text-body">Cập nhật hóa đơn và theo dõi trạng thái thanh toán.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bank transfer info */}
        <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-border-color bg-gray-50">
              <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                <CreditCard className="text-primary" size={20} /> Thông tin chuyển khoản
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between py-2 border-b border-border-color">
                <span className="text-text-body">Ngân hàng</span>
                <span className="font-bold text-text-main">Vietcombank (VCB)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border-color">
                <span className="text-text-body">Số tài khoản</span>
                <span className="font-bold text-text-main text-lg tracking-wider">1234567890</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border-color">
                <span className="text-text-body">Chủ tài khoản</span>
                <span className="font-bold text-text-main">EZONE EDUCATION</span>
              </div>
              
              {pending ? (
                <div className="bg-red-50/50 border border-primary/10 p-4 rounded-lg mt-4 space-y-2">
                  <p className="text-sm text-primary font-bold">Khóa học đăng ký:</p>
                  <p className="text-sm font-medium text-text-main">{pending.courseName}</p>
                  <p className="text-sm text-primary font-bold">Học phí cần đóng:</p>
                  <p className="text-base font-bold text-primary">{pending.price.toLocaleString('vi-VN')} VNĐ</p>
                  
                  <div className="pt-2 border-t border-primary/10">
                    <p className="text-xs text-text-body font-semibold uppercase mb-1">Nội dung chuyển khoản gợi ý:</p>
                    <p className="font-mono text-text-main bg-white p-2 rounded border border-border-color font-bold text-center select-all">
                      EZONE PAY {pending.id}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-border-color p-4 rounded-lg mt-4 text-center">
                  <p className="text-sm text-text-body">Bạn không có đơn đăng ký khóa học nào đang chờ thanh toán.</p>
                  <p className="text-xs text-gray-400 mt-1">Vui lòng đăng ký khóa học ở Trang chủ trước.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload receipt form */}
        <div className="bg-white rounded-xl shadow-sm border border-border-color p-6">
          <h2 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
            <Upload className="text-primary" size={20} /> Tải lên biên lai thanh toán
          </h2>

          {pending ? (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2 text-sm">
                  <CheckCircle size={18} />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-text-main uppercase mb-1.5">Phương thức thanh toán</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Chuyển khoản ngân hàng">Chuyển khoản ngân hàng (Internet Banking)</option>
                  <option value="Momo / Ví điện tử">Momo / Ví điện tử</option>
                  <option value="Thẻ tín dụng">Thẻ tín dụng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-main uppercase mb-1.5">Mã giao dịch (Txn ID / Mã tham chiếu)</label>
                <input
                  type="text"
                  placeholder="Nhập mã giao dịch trên biên lai..."
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-main uppercase mb-1.5">Ảnh minh chứng / Biên lai chuyển khoản</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-color border-dashed rounded-lg hover:border-primary/50 transition-colors relative">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                        <span>Tải ảnh lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                          required
                        />
                      </label>
                      <p className="pl-1">hoặc kéo thả vào đây</p>
                    </div>
                    <p className="text-xs text-gray-500">Hỗ trợ PNG, JPG, JPEG tối đa 5MB</p>
                    {receiptFile && (
                      <p className="text-xs text-green-600 font-bold mt-2">Đã chọn: {receiptFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Đang gửi minh chứng...
                  </span>
                ) : 'Gửi xác nhận thanh toán'}
              </Button>
            </form>
          ) : (
            <div className="p-8 text-center text-text-body bg-gray-50 border border-border-color rounded-lg">
              <p>Vui lòng đăng ký một khóa học trước để có mã thanh toán.</p>
            </div>
          )}
        </div>
      </div>
      
      <h2 className="text-lg font-bold text-text-main mt-12 mb-6">Lịch sử thanh toán</h2>
      <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-text-body border-b border-border-color">
            <tr>
              <th className="p-4 font-semibold">Khóa học</th>
              <th className="p-4 font-semibold">Số tiền</th>
              <th className="p-4 font-semibold">Ngày nộp</th>
              <th className="p-4 font-semibold">Mã giao dịch</th>
              <th className="p-4 font-semibold text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {historyLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-body">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                  Đang tải lịch sử thanh toán...
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-body">
                  Bạn chưa có lịch sử thanh toán nào.
                </td>
              </tr>
            ) : (
              history.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-text-main">{record.enrollment?.course?.courseName || '—'}</td>
                  <td className="p-4 font-bold text-primary">{Number(record.amount).toLocaleString('vi-VN')} VNĐ</td>
                  <td className="p-4 text-text-body">{formatDate(record.paymentDate)}</td>
                  <td className="p-4 text-text-body font-mono text-xs">{record.transactionId}</td>
                  <td className="p-4 text-center">
                    {getStatusBadge(record.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
