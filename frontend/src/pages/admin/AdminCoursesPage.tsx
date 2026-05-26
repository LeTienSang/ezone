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

  // Modal states for create / edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreate = () => {
    setEditingCourse(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      setFormLoading(true);
      setFormError(null);
      if (!editingCourse.id) {
        // create
        await api.post('/api/v1/admin/courses', {
          courseName: editingCourse.courseName,
          description: editingCourse.description,
          price: editingCourse.price,
          duration: editingCourse.duration,
          level: editingCourse.level,
          thumbnail: editingCourse.thumbnail,
          isVisible: true
        });
      } else {
        await api.put(`/api/v1/admin/courses/${editingCourse.id}`, {
          courseName: editingCourse.courseName,
          description: editingCourse.description,
          price: editingCourse.price,
          duration: editingCourse.duration,
          level: editingCourse.level,
          thumbnail: editingCourse.thumbnail,
          isVisible: true
        });
      }
      setIsModalOpen(false);
      await fetchCourses();
    } catch (err: any) {
      setFormError(err.message || 'Lỗi khi lưu khóa học');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (courseId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
    try {
      await api.delete(`/api/v1/admin/courses/${courseId}`);
      await fetchCourses();
    } catch (err: any) {
      alert(err.message || 'Không thể xóa khóa học');
    }
  };
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/80">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BookOpen size={20} className="text-gray-900" />
                {editingCourse && editingCourse.id ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-full">
                <span className="sr-only">Đóng</span>
                ✕
              </button>
            </div>

            <div className="p-6">
              {formError && <div className="mb-3 text-sm text-red-600">{formError}</div>}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tên khóa học *</label>
                  <input value={editingCourse?.courseName || ''} onChange={e => setEditingCourse(prev => ({ ...(prev || {}), courseName: e.target.value }))}
                    required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mô tả</label>
                  <textarea value={editingCourse?.description || ''} onChange={e => setEditingCourse(prev => ({ ...(prev || {}), description: e.target.value }))}
                    className="w-full border rounded px-3 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" step="1000" value={editingCourse?.price || 0} onChange={e => setEditingCourse(prev => ({ ...(prev || {}), price: Number(e.target.value) }))} className="w-full border rounded px-3 py-2" placeholder="Giá (VND)" />
                  <input value={editingCourse?.duration || ''} onChange={e => setEditingCourse(prev => ({ ...(prev || {}), duration: e.target.value }))} className="w-full border rounded px-3 py-2" placeholder="Thời lượng" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={editingCourse?.level || ''} onChange={e => setEditingCourse(prev => ({ ...(prev || {}), level: e.target.value }))} className="w-full border rounded px-3 py-2" placeholder="Cấp độ" />
                  <input value={editingCourse?.thumbnail || ''} onChange={e => setEditingCourse(prev => ({ ...(prev || {}), thumbnail: e.target.value }))} className="w-full border rounded px-3 py-2" placeholder="URL ảnh" />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={formLoading}>Hủy</Button>
                  <Button type="submit" variant="primary" disabled={formLoading}>{formLoading ? 'Đang lưu...' : 'Lưu'}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
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
