import React from 'react';
import { Upload, CreditCard, Clock } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const StudentPaymentPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Thanh toán học phí</h1>
        <p className="text-gray-500">Cập nhật hóa đơn và theo dõi trạng thái thanh toán.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="text-primary" size={20} /> Thông tin chuyển khoản
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Ngân hàng</span>
              <span className="font-bold text-gray-900">Vietcombank</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Số tài khoản</span>
              <span className="font-bold text-gray-900 text-lg">1234567890</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Chủ tài khoản</span>
              <span className="font-bold text-gray-900">EZONE EDUCATION</span>
            </div>
            <div className="bg-red-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-primary font-medium mb-1">Nội dung chuyển khoản:</p>
              <p className="font-mono text-gray-900 bg-white p-2 rounded border border-red-100 font-bold text-center">EZONE NGUYENVANA K45</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Upload className="text-primary" size={20} /> Tải lên biên lai
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Upload size={24} />
            </div>
            <p className="font-medium text-gray-900 mb-1">Kéo thả ảnh hoặc click để chọn file</p>
            <p className="text-sm text-gray-500">Hỗ trợ JPG, PNG (Tối đa 5MB)</p>
          </div>
          
          <Button variant="primary" className="w-full py-3">Gửi xác nhận thanh toán</Button>
        </div>
      </div>
      
      <h2 className="text-lg font-bold text-gray-900 mt-12 mb-6">Lịch sử thanh toán</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium">Khóa học</th>
              <th className="p-4 font-medium">Số tiền</th>
              <th className="p-4 font-medium">Ngày nộp</th>
              <th className="p-4 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium text-gray-900">IELTS Intensive K45</td>
              <td className="p-4 font-bold text-gray-900">4.500.000đ</td>
              <td className="p-4 text-gray-500">20/05/2026</td>
              <td className="p-4">
                <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs font-medium w-fit">
                  <Clock size={14} /> Chờ duyệt
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
