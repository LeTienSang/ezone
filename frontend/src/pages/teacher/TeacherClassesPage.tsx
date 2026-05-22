import React, { useEffect, useState } from 'react';
import { Users, Eye, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

interface CourseCatalog {
  id: number;
  courseName: string;
  price: number;
}

interface ClassEntity {
  id: number;
  className: string;
  course: CourseCatalog;
  startDate: string;
  endDate: string;
  maxStudents: number;
  status: string;
  students: any[];
}

export const TeacherClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchClasses = () => {
    setLoading(true);
    api.get<ClassEntity[]>('/api/v1/classes/my')
      .then(res => {
        setClasses(res.data || []);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Không thể tải danh sách lớp học');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const formatClassStatus = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return { text: 'Đang diễn ra', class: 'bg-green-100 text-green-700' };
      case 'UPCOMING':
        return { text: 'Sắp diễn ra', class: 'bg-blue-100 text-blue-700' };
      case 'COMPLETED':
        return { text: 'Đã kết thúc', class: 'bg-gray-100 text-gray-700' };
      default:
        return { text: status, class: 'bg-yellow-100 text-yellow-700' };
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Quản lý lớp học</h1>
          <p className="text-text-body">Danh sách các lớp bạn đang giảng dạy.</p>
        </div>
        <Button variant="outline" onClick={fetchClasses}>Làm mới</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-text-body">Đang tải danh sách lớp...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="p-12 text-center text-text-body">
            <p>Bạn chưa được phân công phụ trách lớp học nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-text-body border-b border-border-color">
                <tr>
                  <th className="p-4 font-medium">Tên lớp học</th>
                  <th className="p-4 font-medium">Khóa học</th>
                  <th className="p-4 font-medium">Ngày bắt đầu - kết thúc</th>
                  <th className="p-4 font-medium text-center">Sĩ số</th>
                  <th className="p-4 font-medium text-center">Trạng thái</th>
                  <th className="p-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {classes.map((cls) => {
                  const statusInfo = formatClassStatus(cls.status);
                  return (
                    <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-text-main">{cls.className}</td>
                      <td className="p-4 text-text-body">{cls.course?.courseName}</td>
                      <td className="p-4 text-text-body">
                        {formatDate(cls.startDate)} - {formatDate(cls.endDate)}
                      </td>
                      <td className="p-4 text-center">
                        <span className="flex items-center justify-center gap-1 text-text-main">
                          <Users size={16} className="text-gray-400" />{' '}
                          {cls.students ? cls.students.length : 0} / {cls.maxStudents}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.class}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                          className="p-2 text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1 text-sm font-medium"
                        >
                          <Eye size={18} /> Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
