import React from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { dummyPayments } from '../../mocks/data';

export const AdminPaymentsPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thanh toán</h1>
          <p className="text-gray-500">Đối soát và duyệt biên lai học phí từ học viên.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm giao dịch..." 
              className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:border-gray-900 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="p-4 font-medium">Học viên</th>
                <th className="p-4 font-medium">Khóa học / Lớp</th>
                <th className="p-4 font-medium">Số tiền</th>
                <th className="p-4 font-medium">Ngày nộp</th>
                <th className="p-4 font-medium text-center">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{payment.student}</td>
                  <td className="p-4 text-gray-500">{payment.course}</td>
                  <td className="p-4 font-bold text-gray-900">{payment.amount}</td>
                  <td className="p-4 text-gray-500">{payment.date}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${payment.status === 'Đã duyệt' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    {payment.status === 'Chờ duyệt' ? (
                      <>
                        <button className="px-3 py-1.5 bg-gray-900 text-white rounded text-xs hover:bg-gray-800 transition-colors flex items-center gap-1">
                          <CheckCircle size={14} /> Duyệt
                        </button>
                        <button className="px-3 py-1.5 border border-red-500 text-red-500 rounded text-xs hover:bg-red-50 transition-colors flex items-center gap-1">
                          <XCircle size={14} /> Từ chối
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Không có hành động</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
