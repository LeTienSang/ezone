import React from 'react';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { dummyCourses } from '../../mocks/data';
import { Button } from '../../components/common/Button';

export const AdminCoursesPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
          <p className="text-gray-500">Thêm, sửa, xóa danh mục khóa học trên hệ thống.</p>
        </div>
        <Button variant="primary" className="bg-gray-900 hover:bg-gray-800 flex items-center gap-2">
          <Plus size={18} /> Thêm khóa học
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm khóa học..." 
              className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:border-gray-900 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="p-4 font-medium">Tên khóa học</th>
                <th className="p-4 font-medium">Giảng viên mặc định</th>
                <th className="p-4 font-medium">Học phí</th>
                <th className="p-4 font-medium">Thời lượng</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                    <img src={course.image} alt={course.title} className="w-10 h-10 rounded object-cover" />
                    {course.title}
                  </td>
                  <td className="p-4 text-gray-500">{course.instructor}</td>
                  <td className="p-4 text-gray-900 font-medium">{course.price}</td>
                  <td className="p-4 text-gray-500">{course.duration}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-2 h-full mt-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Chỉnh sửa">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Xóa">
                      <Trash2 size={16} />
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
