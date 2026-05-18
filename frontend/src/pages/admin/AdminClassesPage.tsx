import React from 'react';
import { Search, Users, Plus, Eye } from 'lucide-react';
import { dummyTeacherClasses } from '../../mocks/data'; // Reusing teacher classes for admin view
import { Button } from '../../components/common/Button';

export const AdminClassesPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lớp học</h1>
          <p className="text-gray-500">Mở lớp, chỉ định giảng viên và xếp lớp cho học viên.</p>
        </div>
        <Button variant="primary" className="bg-gray-900 hover:bg-gray-800 flex items-center gap-2">
          <Plus size={18} /> Mở lớp mới
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm lớp học..." 
              className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:border-gray-900 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="p-4 font-medium">Tên lớp</th>
                <th className="p-4 font-medium">Giảng viên</th>
                <th className="p-4 font-medium">Lịch học</th>
                <th className="p-4 font-medium text-center">Sĩ số</th>
                <th className="p-4 font-medium text-center">Trạng thái</th>
                <th className="p-4 font-medium text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyTeacherClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{cls.name}</td>
                  <td className="p-4 text-gray-500">Trần Văn B</td>
                  <td className="p-4 text-gray-500">{cls.schedule}</td>
                  <td className="p-4 text-center">
                    <span className="flex items-center justify-center gap-1 text-gray-900">
                      <Users size={16} className="text-gray-400" /> {cls.students}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${cls.status === 'Đang diễn ra' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {cls.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye size={18} />
                    </button>
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
