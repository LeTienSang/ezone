import React, { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Loader2, Eye, X, Award, UserPlus, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

interface Course {
  id: number;
  courseName: string;
  price: number;
}

interface Enrollment {
  id: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  registrationDate: string;
  user: User;
  course: Course;
}

interface Payment {
  id: number;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  proofUrl: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentDate: string;
  enrollment: Enrollment;
}

interface ClassEntity {
  id: number;
  className: string;
  course: {
    id: number;
    courseName: string;
  };
  students: any[];
  maxStudents: number;
}

export const AdminPaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PAYMENTS' | 'ENROLLMENTS'>('PAYMENTS');
  
  // Data lists
  const [payments, setPayments] = useState<Payment[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  
  // Status states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Actions states
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [rejectingPaymentId, setRejectingPaymentId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  
  const [approvingEnrollment, setApprovingEnrollment] = useState<Enrollment | null>(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [paymentsRes, enrollmentsRes, classesRes] = await Promise.all([
        api.get<{ content: Payment[] }>('/api/v1/payments?size=100'),
        api.get<{ content: Enrollment[] }>('/api/v1/enrollments?size=100'),
        api.get<{ content: ClassEntity[] }>('/api/v1/classes?size=100')
      ]);

      setPayments(paymentsRes.data.content || []);
      setEnrollments(enrollmentsRes.data.content || []);
      setClasses(classesRes.data.content || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu giao dịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmPayment = async (id: number) => {
    if (!window.confirm('Xác nhận duyệt biên lai thanh toán này?')) return;
    try {
      setProcessingId(id);
      await api.patch(`/api/v1/payments/${id}/confirm`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi phê duyệt thanh toán');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPaymentId || !rejectReason.trim()) return;
    try {
      setProcessingId(rejectingPaymentId);
      await api.patch(`/api/v1/payments/${rejectingPaymentId}/reject`, {
        reason: rejectReason.trim()
      });
      setRejectingPaymentId(null);
      setRejectReason('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi từ chối thanh toán');
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingEnrollment || !selectedClassId) return;
    try {
      setProcessingId(approvingEnrollment.id);
      await api.patch(`/api/v1/enrollments/${approvingEnrollment.id}/approve`, {
        classId: parseInt(selectedClassId)
      });
      setApprovingEnrollment(null);
      setSelectedClassId('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xếp lớp học viên');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectEnrollment = async (id: number) => {
    if (!window.confirm('Xác nhận từ chối đơn đăng ký tư vấn này?')) return;
    try {
      setProcessingId(id);
      await api.patch(`/api/v1/enrollments/${id}/reject`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi hủy đơn đăng ký');
    } finally {
      setProcessingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Filters
  const filteredPayments = payments.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      p.enrollment?.user?.fullName?.toLowerCase().includes(query) ||
      p.enrollment?.course?.courseName?.toLowerCase().includes(query) ||
      p.transactionId?.toLowerCase().includes(query)
    );
  });

  const filteredEnrollments = enrollments.filter(e => {
    const query = searchQuery.toLowerCase();
    return (
      e.user?.fullName?.toLowerCase().includes(query) ||
      e.course?.courseName?.toLowerCase().includes(query) ||
      e.user?.email?.toLowerCase().includes(query)
    );
  });

  // Filter classes available for a specific course
  const availableClasses = approvingEnrollment 
    ? classes.filter(cls => cls.course?.id === approvingEnrollment.course?.id)
    : [];

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý thanh toán & Đăng ký</h1>
          <p className="text-gray-500 text-sm mt-1">Duyệt biên lai học phí, đối soát giao dịch và xếp lớp học viên.</p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1 border border-gray-200">
          <button 
            onClick={() => { setActiveTab('PAYMENTS'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'PAYMENTS' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-550 hover:text-gray-900'
            }`}
          >
            Biên lai học phí ({payments.length})
          </button>
          <button 
            onClick={() => { setActiveTab('ENROLLMENTS'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ENROLLMENTS' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-550 hover:text-gray-900'
            }`}
          >
            Đơn đăng ký tư vấn ({enrollments.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder={activeTab === 'PAYMENTS' ? "Tìm kiếm theo học viên, khóa học, mã giao dịch..." : "Tìm kiếm theo học viên, email, khóa học..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-955 focus:ring-1 focus:ring-gray-955 text-sm bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} className="h-10">
            Tải lại
          </Button>
        </div>

        {error && (
          <div className="p-6 text-center text-red-600 bg-red-50 border-b border-red-100 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-gray-400" size={32} />
              <span className="text-gray-500 text-sm">Đang tải danh sách dữ liệu...</span>
            </div>
          ) : activeTab === 'PAYMENTS' ? (
            // Payments Tab View
            filteredPayments.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-sm font-medium">
                Không tìm thấy biên lai thanh toán nào.
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 font-semibold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Học viên</th>
                    <th className="p-4">Thông tin khóa học</th>
                    <th className="p-4">Thông tin chuyển khoản</th>
                    <th className="p-4">Số tiền</th>
                    <th className="p-4">Minh chứng</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4 pr-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-gray-900">
                        <p>{payment.enrollment?.user?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-400 font-normal mt-0.5">{payment.enrollment?.user?.email}</p>
                      </td>
                      <td className="p-4 text-gray-700">
                        <p className="font-semibold text-gray-800">{payment.enrollment?.course?.courseName}</p>
                        <p className="text-xs text-gray-450 mt-0.5">Đơn hàng #{payment.enrollment?.id}</p>
                      </td>
                      <td className="p-4 text-gray-600 font-medium">
                        <p className="text-xs text-gray-500">Mã GD: <span className="font-mono font-bold text-gray-800">{payment.transactionId || 'N/A'}</span></p>
                        <p className="text-[11px] text-gray-400 mt-0.5">PTTT: {payment.paymentMethod}</p>
                      </td>
                      <td className="p-4 text-gray-900 font-bold">{formatPrice(payment.amount)}</td>
                      <td className="p-4">
                        {payment.proofUrl ? (
                          <button 
                            onClick={() => setPreviewImageUrl(payment.proofUrl)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline bg-blue-50 px-2 py-1 rounded border border-blue-100 transition-colors"
                          >
                            <ImageIcon size={14} /> Xem ảnh
                          </button>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Không có</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                          payment.status === 'SUCCESS' 
                            ? 'bg-green-50 text-green-700 border border-green-150' 
                            : payment.status === 'FAILED'
                            ? 'bg-red-50 text-red-700 border border-red-155'
                            : 'bg-yellow-50 text-yellow-750 border border-yellow-150'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            payment.status === 'SUCCESS' ? 'bg-green-500' : payment.status === 'FAILED' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></span>
                          {payment.status === 'SUCCESS' ? 'Đã duyệt' : payment.status === 'FAILED' ? 'Bị từ chối' : 'Chờ duyệt'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {payment.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleConfirmPayment(payment.id)}
                              disabled={processingId !== null}
                              className="px-2.5 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              <CheckCircle size={14} /> Duyệt
                            </button>
                            <button 
                              onClick={() => setRejectingPaymentId(payment.id)}
                              disabled={processingId !== null}
                              className="px-2.5 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              <XCircle size={14} /> Từ chối
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            // Enrollments Tab View
            filteredEnrollments.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-sm font-medium">
                Không tìm thấy đơn đăng ký tư vấn nào.
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 font-semibold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Người đăng ký</th>
                    <th className="p-4">Khóa học đăng ký</th>
                    <th className="p-4">Số điện thoại</th>
                    <th className="p-4">Ngày đăng ký</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4 pr-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-gray-900">
                        <p>{enrollment.user?.fullName}</p>
                        <p className="text-xs text-gray-400 font-normal mt-0.5">{enrollment.user?.email}</p>
                      </td>
                      <td className="p-4 text-gray-700">
                        <p className="font-semibold text-gray-800">{enrollment.course?.courseName}</p>
                        <p className="text-xs text-gray-450 mt-0.5">Học phí: {formatPrice(enrollment.course?.price)}</p>
                      </td>
                      <td className="p-4 text-gray-650 font-mono text-xs">{enrollment.user?.phone || 'Chưa cung cấp'}</td>
                      <td className="p-4 text-gray-500 text-xs">
                        {enrollment.registrationDate ? new Date(enrollment.registrationDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                          enrollment.status === 'PAID' 
                            ? 'bg-green-50 text-green-700 border border-green-150' 
                            : enrollment.status === 'CANCELLED'
                            ? 'bg-red-50 text-red-700 border border-red-155'
                            : 'bg-yellow-50 text-yellow-750 border border-yellow-150'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            enrollment.status === 'PAID' ? 'bg-green-500' : enrollment.status === 'CANCELLED' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></span>
                          {enrollment.status === 'PAID' ? 'Đã xếp lớp/thanh toán' : enrollment.status === 'CANCELLED' ? 'Đã hủy' : 'Chờ tư vấn'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {enrollment.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => {
                                setApprovingEnrollment(enrollment);
                                setSelectedClassId('');
                              }}
                              disabled={processingId !== null}
                              className="px-2.5 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <UserPlus size={14} /> Xếp lớp & Duyệt
                            </button>
                            <button 
                              onClick={() => handleRejectEnrollment(enrollment.id)}
                              disabled={processingId !== null}
                              className="px-2.5 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              <XCircle size={14} /> Hủy
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Hoàn tất</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setPreviewImageUrl(null)}>
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-2xl p-2 animate-scaleIn" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-4 right-4 p-2 bg-slate-950/60 hover:bg-slate-950/80 rounded-full transition-all text-white"
            >
              <X size={18} />
            </button>
            <img 
              src={previewImageUrl} 
              alt="Receipt Proof" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Reject Payment Reason Modal */}
      {rejectingPaymentId && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <XCircle size={18} className="text-red-500" />
                Từ chối thanh toán
              </h2>
              <button 
                onClick={() => setRejectingPaymentId(null)}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleRejectPaymentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Lý do từ chối *</label>
                <textarea 
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Ví dụ: Hình ảnh minh chứng mờ, số tiền không trùng khớp, hoặc mã giao dịch không hợp lệ..."
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-955 focus:ring-1 focus:ring-gray-955 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setRejectingPaymentId(null)}>Hủy bỏ</Button>
                <Button type="submit" variant="primary" className="bg-red-650 hover:bg-red-700 text-white border-none">
                  Từ chối
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Class & Approve Enrollment Modal */}
      {approvingEnrollment && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <UserPlus size={18} className="text-gray-900" />
                Xếp lớp cho học viên
              </h2>
              <button 
                onClick={() => setApprovingEnrollment(null)}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleApproveEnrollment} className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500">Học viên:</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{approvingEnrollment.user?.fullName}</p>
                <p className="text-xs text-gray-400">{approvingEnrollment.user?.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Khóa học đăng ký:</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{approvingEnrollment.course?.courseName}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Chọn lớp học phù hợp *</label>
                <select 
                  required
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-955 focus:ring-1 focus:ring-gray-955 text-sm bg-white"
                >
                  <option value="">-- Chọn lớp học --</option>
                  {availableClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.className} (Sĩ số: {cls.students ? cls.students.length : 0}/{cls.maxStudents})
                    </option>
                  ))}
                </select>
                {availableClasses.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1.5">
                    * Hiện chưa có lớp học nào đang mở cho khóa học này. Hãy tạo lớp học mới trước!
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setApprovingEnrollment(null)}>Hủy bỏ</Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="bg-gray-900 hover:bg-gray-850"
                  disabled={!selectedClassId}
                >
                  Xác nhận & Xếp lớp
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

