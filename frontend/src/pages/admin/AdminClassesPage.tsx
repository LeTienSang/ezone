import React, { useEffect, useState } from 'react';
import { Search, Users, Plus, Loader2, X, Calendar, BookOpen, Video, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';

interface Course {
  id: number;
  courseName: string;
}

interface Instructor {
  id: number;
  fullName: string;
  specialization: string;
}

interface ClassEntity {
  id: number;
  className: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  course: {
    id: number;
    courseName: string;
  };
  instructor: {
    id: number;
    user: {
      fullName: string;
    };
  };
  students: any[];
}

interface ClassSession {
  id: number;
  title: string;
  sessionDate: string;
  room?: string | null;
  content?: string | null;
}

export const AdminClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedClassSessions, setSelectedClassSessions] = useState<ClassSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form fields
  const [className, setClassName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxStudents, setMaxStudents] = useState(20);

  const formatDateTime = (value: string) => {
    if (!value) return '';
    try {
      return new Date(value).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return value;
    }
  };

  const loadClassSessions = async (classId: number) => {
    try {
      setSessionsLoading(true);
      setSessionsError(null);
      const response = await api.get<ClassSession[]>(`/api/v1/classes/${classId}/sessions`);
      const sortedSessions = [...(response.data || [])].sort(
        (a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
      );
      setSelectedClassSessions(sortedSessions);
    } catch (err: any) {
      setSelectedClassSessions([]);
      setSessionsError(err.message || 'Không thể tải danh sách buổi học');
    } finally {
      setSessionsLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<{ content: ClassEntity[] }>('/api/v1/classes?size=100');
      setClasses(response.data.content || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const openCreateModal = async () => {
    setIsModalOpen(true);
    setSubmitError(null);
    setClassName('');
    setCourseId('');
    setInstructorId('');
    setStartDate('');
    setEndDate('');
    setMaxStudents(20);
    
    // Pre-fetch courses and instructors
    try {
      setModalLoading(true);
      const [coursesRes, instructorsRes] = await Promise.all([
        api.get<{ content: Course[] }>('/api/v1/courses?size=100'),
        api.get<Instructor[]>('/api/v1/instructors')
      ]);
      setCourses(coursesRes.data.content || []);
      setInstructors(instructorsRes.data || []);
    } catch (err: any) {
      setSubmitError('Không thể tải danh mục khóa học hoặc giảng viên');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className || !courseId || !instructorId || !startDate || !endDate) {
      setSubmitError('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    try {
      setSubmitError(null);
      const response = await api.post<ClassEntity>('/api/v1/classes', {
        className,
        courseId: parseInt(courseId),
        instructorId: parseInt(instructorId),
        startDate,
        endDate,
        maxStudents
      });
      setIsModalOpen(false);
      await fetchClasses();

      const createdClassId = response.data?.id;
      if (createdClassId) {
        setSelectedClassId(createdClassId);
        await loadClassSessions(createdClassId);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Không thể tạo lớp học mới');
    }
  };

  const filteredClasses = classes.filter(cls => 
    cls.className?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.course?.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.instructor?.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">Đang diễn ra</span>;
      case 'UPCOMING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-750 border border-yellow-100">Sắp khai giảng</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">Đã kết thúc</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-100">{status}</span>;
    }
  };

  const selectedClass = classes.find(cls => cls.id === selectedClassId) || null;

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý lớp học</h1>
          <p className="text-gray-500 text-sm mt-1">Mở lớp học mới, phân công giảng viên và quản lý sĩ số.</p>
        </div>
        <Button variant="primary" className="bg-gray-900 hover:bg-gray-800 flex items-center gap-2" onClick={openCreateModal}>
          <Plus size={18} /> Mở lớp mới
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm lớp học, khóa học, giảng viên..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-955 focus:ring-1 focus:ring-gray-955 text-sm bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Button variant="outline" size="sm" onClick={fetchClasses} className="h-10">
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
              <span className="text-gray-500 text-sm">Đang tải danh sách lớp học...</span>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm font-medium">
              Không tìm thấy lớp học nào.
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Lớp học</th>
                  <th className="p-4">Khóa học</th>
                  <th className="p-4">Giảng viên</th>
                  <th className="p-4">Thời gian</th>
                  <th className="p-4 text-center">Sĩ số</th>
                  <th className="p-4 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {filteredClasses.map((cls) => (
                  <tr
                    key={cls.id}
                    className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedClassId === cls.id ? 'bg-gray-50' : ''}`}
                    onClick={() => {
                      setSelectedClassId(cls.id);
                      loadClassSessions(cls.id);
                    }}
                  >
                    <td className="p-4 pl-6 font-bold text-gray-900">{cls.className}</td>
                    <td className="p-4 text-gray-700">{cls.course?.courseName}</td>
                    <td className="p-4 text-gray-600 font-medium">{cls.instructor?.user?.fullName || 'N/A'}</td>
                    <td className="p-4 text-gray-500 text-xs font-mono">
                      {cls.startDate} ~ {cls.endDate}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-gray-900 font-semibold bg-gray-100 px-2.5 py-1 rounded-full text-xs border border-gray-150">
                        <Users size={14} className="text-gray-500" /> 
                        {cls.students ? cls.students.length : 0} / {cls.maxStudents}
                      </span>
                    </td>
                    <td className="p-4 text-center">{getStatusBadge(cls.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedClass && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-50/50">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={18} className="text-gray-900" />
                Buổi học của {selectedClass.className}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {selectedClass.course?.courseName} · {selectedClass.startDate} ~ {selectedClass.endDate}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadClassSessions(selectedClass.id)}
              className="h-10 inline-flex items-center gap-2"
              disabled={sessionsLoading}
            >
              <RefreshCw size={14} className={sessionsLoading ? 'animate-spin' : ''} />
              Tải lại buổi học
            </Button>
          </div>

          <div className="p-4">
            {sessionsError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
                {sessionsError}
              </div>
            )}

            {sessionsLoading ? (
              <div className="flex items-center justify-center py-10 gap-3 text-gray-500 text-sm">
                <Loader2 className="animate-spin" size={20} />
                Đang tải danh sách buổi học...
              </div>
            ) : selectedClassSessions.length === 0 ? (
              <div className="text-center py-10 text-sm text-gray-500">
                Lớp này chưa có buổi học nào.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {selectedClassSessions.map((session) => (
                  <div key={session.id} className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-gray-900">{session.title}</p>
                        <p className="mt-1 text-xs text-gray-500">{formatDateTime(session.sessionDate)}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-700">
                        <Video size={12} />
                        Buổi học
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">Phòng học</span>
                        <span className="font-medium text-gray-900 text-right">
                          {session.room?.trim() ? session.room : 'Chưa cập nhật'}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-gray-500">Nội dung</span>
                        <span className="font-medium text-gray-900 text-right max-w-[60%]">
                          {session.content?.trim() ? session.content : 'Chưa có mô tả'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/80">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BookOpen size={20} className="text-gray-900" />
                Mở lớp học mới
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            {submitError && (
              <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-xs font-medium text-red-650">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreateClass} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tên lớp học *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: IELTS Advanced - K99"
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-955 focus:ring-1 focus:ring-gray-955 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Khóa học *</label>
                  <select 
                    required
                    value={courseId}
                    onChange={e => setCourseId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-955 focus:ring-1 focus:ring-gray-955 text-sm bg-white"
                  >
                    <option value="">-- Chọn khóa học --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.courseName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Giảng viên phụ trách *</label>
                  <select 
                    required
                    value={instructorId}
                    onChange={e => setInstructorId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-955 focus:ring-1 focus:ring-gray-955 text-sm bg-white"
                  >
                    <option value="">-- Chọn giảng viên --</option>
                    {instructors.map(inst => (
                      <option key={inst.id} value={inst.id}>
                        {inst.fullName} ({inst.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Ngày bắt đầu *</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-955 focus:ring-1 focus:ring-gray-955 text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Ngày kết thúc *</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-955 focus:ring-1 focus:ring-gray-955 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Sĩ số tối đa</label>
                <input 
                  type="number" 
                  min={1}
                  max={100}
                  value={maxStudents}
                  onChange={e => setMaxStudents(parseInt(e.target.value) || 20)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-955 focus:ring-1 focus:ring-gray-955 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-gray-250 flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={modalLoading}
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="bg-gray-900 hover:bg-gray-800"
                  disabled={modalLoading}
                >
                  {modalLoading ? 'Đang xử lý...' : 'Mở lớp'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

