import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Loader2, BookOpen } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';

interface Course {
  id: number;
  courseName: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  thumbnail: string;
}

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<{ content: Course[] }>('/api/v1/courses?size=100');
      setCourses(response.data.content || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý khóa học</h1>
          <p className="text-gray-500 text-sm mt-1">Danh mục khóa học hiện có trên hệ thống Ezone.</p>
        </div>
        <Button 
          variant="primary" 
          className="bg-gray-900 hover:bg-gray-800 flex items-center gap-2"
          onClick={() => alert('Chức năng thêm khóa học mới chưa được mở ở Backend. Các khóa học hiện tại được quản lý thông qua cơ sở dữ liệu hệ thống.')}
        >
          <Plus size={18} /> Thêm khóa học
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm khóa học theo tên hoặc mô tả..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-955 focus:ring-1 focus:ring-gray-955 text-sm bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Button variant="outline" size="sm" onClick={fetchCourses} className="h-10">
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
              <span className="text-gray-500 text-sm">Đang tải danh sách khóa học...</span>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm font-medium">
              Không tìm thấy khóa học nào.
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Khóa học</th>
                  <th className="p-4">Cấp độ</th>
                  <th className="p-4">Học phí</th>
                  <th className="p-4">Thời lượng</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <img 
                          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300"} 
                          alt={course.courseName} 
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100 bg-gray-50" 
                        />
                        <div className="max-w-md">
                          <p className="font-bold text-gray-900">{course.courseName}</p>
                          <p className="text-xs text-gray-400 font-normal line-clamp-1 mt-0.5">{course.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                        {course.level}
                      </span>
                    </td>
                    <td className="p-4 text-gray-900 font-semibold">{formatPrice(course.price)}</td>
                    <td className="p-4 text-gray-500 font-medium">{course.duration}</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => alert('Tính năng chỉnh sửa khóa học sẽ được cập nhật trong phiên bản tiếp theo.')}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => alert('Tính năng xóa khóa học chưa được cấu hình ở Backend.')}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
