import React from 'react';
import { Search, Filter, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { dummyUsersList } from '../../mocks/data';
import { Button } from '../../components/common/Button';

export const AdminUsersPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-500">Phân quyền và quản lý tài khoản trên hệ thống.</p>
        </div>
        <Button variant="primary" className="bg-gray-900 hover:bg-gray-800">Thêm người dùng mới</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, email..." 
              className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:border-gray-900 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-gray-900">
              <option>Vai trò: Tất cả</option>
              <option>Học viên</option>
              <option>Giảng viên</option>
            </select>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 border border-gray-300 rounded-md text-sm">
              <Filter size={16} /> Lọc
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="p-4 font-medium">Họ & Tên</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Vai trò</th>
                <th className="p-4 font-medium">Ngày tham gia</th>
                <th className="p-4 font-medium text-center">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyUsersList.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{user.name}</td>
                  <td className="p-4 text-gray-500">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'Giảng viên' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{user.date}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Chỉnh sửa">
                      <Edit size={16} />
                    </button>
                    {user.status === 'Hoạt động' ? (
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Khóa tài khoản">
                        <ShieldAlert size={16} />
                      </button>
                    ) : (
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Xóa tài khoản">
                        <Trash2 size={16} />
                      </button>
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
