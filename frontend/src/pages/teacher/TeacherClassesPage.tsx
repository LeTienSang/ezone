import React from 'react';
import { Users, MoreVertical, Eye } from 'lucide-react';
import { dummyTeacherClasses } from '../../mocks/data';
import { Button } from '../../components/common/Button';

export const TeacherClassesPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Quản lý lớp học</h1>
          <p className="text-text-body">Danh sách các lớp bạn đang giảng dạy.</p>
        </div>
        <Button variant="primary">Tạo lớp học mới</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-text-body border-b border-border-color">
              <tr>
                <th className="p-4 font-medium">Tên lớp học</th>
                <th className="p-4 font-medium">Lịch học</th>
                <th className="p-4 font-medium text-center">Sĩ số</th>
                <th className="p-4 font-medium text-center">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {dummyTeacherClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-text-main">{cls.name}</td>
                  <td className="p-4 text-text-body">{cls.schedule}</td>
                  <td className="p-4 text-center">
                    <span className="flex items-center justify-center gap-1 text-text-main">
                      <Users size={16} className="text-gray-400" /> {cls.students}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${cls.status === 'Đang diễn ra' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {cls.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-text-main transition-colors">
                      <MoreVertical size={18} />
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
