import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, FileText, CheckSquare, Plus, Video, Loader2, ArrowLeft, Trash2, Calendar, Send, Save, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

interface CourseCatalog {
  id: number;
  courseName: string;
}

interface ClassEntity {
  id: number;
  className: string;
  course: CourseCatalog;
  startDate: string;
  endDate: string;
  maxStudents: number;
  status: string;
}

interface ClassSession {
  id: number;
  title: string;
  sessionDate: string;
  room: string;
  content: string;
}

interface Material {
  id: number;
  title: string;
  materialType: string;
  fileUrl: string;
  uploadedAt: string;
}

interface AssignmentResponse {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submissionStatus?: string;
}

interface Attendance {
  id: number;
  student: User;
  status: string;
  note: string;
}

export const TeacherClassDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState<ClassEntity | null>(null);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);

  // Attendance state
  const [selectedSessionId, setSelectedSessionId] = useState<number | ''>('');
  const [attendanceRecords, setAttendanceRecords] = useState<Record<number, { status: string; note: string }>>({});
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);

  // Modals state
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState('PDF');
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [uploadingMaterial, setUploadingMaterial] = useState(false);

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [assignmentMaxScore, setAssignmentMaxScore] = useState(10);
  const [creatingAssignment, setCreatingAssignment] = useState(false);

  // General state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [classRes, sessionsRes, membersRes, materialsRes, assignmentsRes] = await Promise.all([
        api.get<ClassEntity>(`/api/v1/classes/${id}`),
        api.get<ClassSession[]>(`/api/v1/classes/${id}/sessions`),
        api.get<User[]>(`/api/v1/classes/${id}/members`),
        api.get<Material[]>(`/api/v1/classes/${id}/materials`),
        api.get<AssignmentResponse[]>(`/api/v1/classes/${id}/assignments`)
      ]);

      setClassroom(classRes.data);
      const sortedSessions = (sessionsRes.data || []).sort(
        (a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
      );
      setSessions(sortedSessions);
      setMembers(membersRes.data || []);
      setMaterials(materialsRes.data || []);
      setAssignments(assignmentsRes.data || []);

      if (sortedSessions.length > 0) {
        setSelectedSessionId(sortedSessions[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể tải chi tiết lớp học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchClassDetails();
    }
  }, [id]);

  // Load attendance when session selection changes
  useEffect(() => {
    if (!id || !selectedSessionId) return;

    const loadAttendance = async () => {
      try {
        setLoadingAttendance(true);
        const res = await api.get<Attendance[]>(`/api/v1/classes/${id}/sessions/${selectedSessionId}/attendance`);
        const records = res.data || [];
        
        const initialRecords: Record<number, { status: string; note: string }> = {};
        // Initialize from class members first (default present)
        members.forEach(member => {
          initialRecords[member.id] = { status: 'PRESENT', note: '' };
        });

        // Overlay saved records
        records.forEach(rec => {
          if (rec.student) {
            initialRecords[rec.student.id] = {
              status: rec.status,
              note: rec.note || ''
            };
          }
        });
        
        setAttendanceRecords(initialRecords);
      } catch (err) {
        console.error('Error loading attendance', err);
      } finally {
        setLoadingAttendance(false);
      }
    };

    loadAttendance();
  }, [selectedSessionId, members, id]);

  const handleAttendanceChange = (studentId: number, status: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleAttendanceNoteChange = (studentId: number, note: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note
      }
    }));
  };

  const saveAttendance = async () => {
    if (!id || !selectedSessionId) return;
    try {
      setSavingAttendance(true);
      setError('');
      setSuccessMsg('');

      const recordsList = Object.entries(attendanceRecords).map(([studentId, data]) => ({
        studentId: parseInt(studentId),
        status: data.status.toLowerCase(),
        note: data.note
      }));

      await api.post(`/api/v1/classes/${id}/sessions/${selectedSessionId}/attendance`, {
        records: recordsList
      });

      setSuccessMsg('Lưu điểm danh thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi lưu điểm danh');
    } finally {
      setSavingAttendance(false);
    }
  };

  // Add material
  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !materialFile || !materialTitle) return;

    try {
      setUploadingMaterial(true);
      setError('');
      setSuccessMsg('');

      const formData = new FormData();
      formData.append('file', materialFile);
      formData.append('title', materialTitle);
      formData.append('materialType', materialType);

      await api.postForm(`/api/v1/classes/${id}/materials`, formData);

      // Refresh materials list
      const materialsRes = await api.get<Material[]>(`/api/v1/classes/${id}/materials`);
      setMaterials(materialsRes.data || []);

      setSuccessMsg('Đăng tải tài liệu thành công!');
      setShowMaterialModal(false);
      setMaterialTitle('');
      setMaterialFile(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi tải tài liệu lên');
    } finally {
      setUploadingMaterial(false);
    }
  };

  // Delete material
  const handleDeleteMaterial = async (materialId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
    try {
      setError('');
      await api.delete(`/api/v1/classes/${id}/materials/${materialId}`);
      setMaterials(prev => prev.filter(m => m.id !== materialId));
      setSuccessMsg('Xóa tài liệu thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể xóa tài liệu');
    }
  };

  // Create assignment
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !assignmentTitle || !assignmentDueDate) return;

    try {
      setCreatingAssignment(true);
      setError('');
      setSuccessMsg('');

      // Format dueDate to match localdatetime in backend: yyyy-MM-ddTHH:mm:ss
      // DateTime-local input returns "yyyy-MM-ddTHH:mm", so we append ":00"
      let formattedDate = assignmentDueDate;
      if (assignmentDueDate.length === 16) {
        formattedDate = assignmentDueDate + ':00';
      }

      await api.post(`/api/v1/classes/${id}/assignments`, {
        title: assignmentTitle,
        description: assignmentDescription,
        dueDate: formattedDate,
        maxScore: assignmentMaxScore
      });

      // Refresh assignments
      const assignmentsRes = await api.get<AssignmentResponse[]>(`/api/v1/classes/${id}/assignments`);
      setAssignments(assignmentsRes.data || []);

      setSuccessMsg('Giao bài tập mới thành công!');
      setShowAssignmentModal(false);
      setAssignmentTitle('');
      setAssignmentDescription('');
      setAssignmentDueDate('');
      setAssignmentMaxScore(10);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi tạo bài tập');
    } finally {
      setCreatingAssignment(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
        <p className="text-text-body font-medium">Đang tải chi tiết lớp học...</p>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-border-color shadow-sm">
        <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-text-main mb-2">Không tìm thấy lớp học</h2>
        <Button variant="primary" onClick={() => navigate('/teacher/classes')}>Quay lại danh sách</Button>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <button 
        onClick={() => navigate('/teacher/classes')} 
        className="flex items-center gap-1 text-text-body hover:text-primary transition-colors mb-6 font-medium text-sm"
      >
        <ArrowLeft size={16} /> Quay lại danh sách lớp
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r text-red-700 flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r text-green-700 font-medium">
          {successMsg}
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-3 inline-block">
            {classroom.status === 'ONGOING' ? 'Đang diễn ra' : classroom.status === 'UPCOMING' ? 'Sắp diễn ra' : 'Đã kết thúc'}
          </span>
          <h1 className="text-3xl font-bold text-text-main mb-2">{classroom.className}</h1>
          <p className="text-text-body flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>Khóa học: <strong className="text-text-main">{classroom.course?.courseName}</strong></span>
            <span>Sĩ số: <strong className="text-text-main">{members.length} học viên</strong></span>
            <span>Thời gian: <strong className="text-text-main">{formatDate(classroom.startDate)} - {formatDate(classroom.endDate)}</strong></span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-primary text-primary hover:bg-red-50 font-medium"
            onClick={() => window.open('https://meet.google.com', '_blank')}
          >
            <Video size={18} /> Vào lớp Zoom/Meet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Section */}
        <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border-color flex flex-col gap-3 bg-gray-50">
            <h2 className="font-bold text-text-main flex items-center gap-2">
              <Users size={18} className="text-primary"/> Điểm danh lớp học
            </h2>
            
            {sessions.length > 0 ? (
              <div className="space-y-1">
                <label className="text-xs text-text-body font-semibold">Chọn buổi học:</label>
                <select 
                  value={selectedSessionId} 
                  onChange={(e) => setSelectedSessionId(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full border border-border-color rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main font-medium"
                >
                  {sessions.map((sess) => (
                    <option key={sess.id} value={sess.id}>
                      {sess.title} ({formatDate(sess.sessionDate)})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-xs text-red-500 font-medium">Lớp học chưa được cấu hình buổi học nào.</p>
            )}
          </div>

          <div className="flex-1 max-h-96 overflow-y-auto divide-y divide-gray-100">
            {loadingAttendance ? (
              <div className="p-8 flex justify-center items-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-2 text-xs text-text-body">Đang tải điểm danh...</span>
              </div>
            ) : members.length === 0 ? (
              <p className="p-6 text-center text-xs text-text-body">Chưa có học viên nào trong lớp.</p>
            ) : (
              members.map((member) => {
                const record = attendanceRecords[member.id] || { status: 'PRESENT', note: '' };
                return (
                  <div key={member.id} className="p-4 flex flex-col gap-2 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-text-main">{member.fullName}</span>
                      <div className="flex gap-1">
                        {[
                          { val: 'PRESENT', label: 'Có mặt', color: 'border-green-500 text-green-500 hover:bg-green-50 bg-green-50/20' },
                          { val: 'ABSENT', label: 'Vắng', color: 'border-red-500 text-red-500 hover:bg-red-50 bg-red-50/20' },
                          { val: 'LATE', label: 'Muộn', color: 'border-yellow-500 text-yellow-500 hover:bg-yellow-50 bg-yellow-50/20' }
                        ].map((btn) => {
                          const active = record.status === btn.val;
                          return (
                            <button
                              key={btn.val}
                              onClick={() => handleAttendanceChange(member.id, btn.val)}
                              className={`px-2 py-1 rounded border text-xs font-bold transition-all ${
                                active ? `${btn.color} ring-1 ring-offset-1` : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                              }`}
                              title={btn.label}
                            >
                              {btn.val.substring(0, 1)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Ghi chú (nếu có)..." 
                      value={record.note}
                      onChange={(e) => handleAttendanceNoteChange(member.id, e.target.value)}
                      className="w-full text-xs border border-border-color rounded px-2 py-1 focus:outline-none focus:border-primary bg-white text-text-main"
                    />
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 border-t border-border-color bg-gray-50">
            <Button 
              variant="primary" 
              className="w-full text-sm flex items-center justify-center gap-2"
              onClick={saveAttendance}
              disabled={savingAttendance || members.length === 0 || !selectedSessionId}
            >
              {savingAttendance ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Lưu điểm danh
            </Button>
          </div>
        </div>

        {/* Materials & Homework Section */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Materials Catalog */}
          <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border-color flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-text-main flex items-center gap-2">
                <FileText size={18} className="text-primary"/> Kho tài liệu giảng dạy
              </h2>
              <button 
                onClick={() => setShowMaterialModal(true)}
                className="text-sm text-primary font-bold flex items-center gap-1 hover:underline focus:outline-none"
              >
                <Plus size={16}/> Thêm mới
              </button>
            </div>
            
            <div className="p-4">
              {materials.length === 0 ? (
                <div className="py-6 text-center text-sm text-text-body">
                  Chưa có tài liệu nào được tải lên.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {materials.map((mat) => (
                    <div 
                      key={mat.id} 
                      className="border border-border-color p-3 rounded-lg flex items-center justify-between hover:border-primary transition-all group"
                    >
                      <a 
                        href={mat.fileUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-start gap-3 flex-1 min-w-0"
                      >
                        <div className="bg-red-100 text-primary w-10 h-10 rounded flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {mat.materialType}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-text-main line-clamp-1 group-hover:text-primary transition-colors">
                            {mat.title}
                          </p>
                          <p className="text-xs text-text-body mt-1">Đăng tải: {formatDate(mat.uploadedAt)}</p>
                        </div>
                      </a>
                      
                      <button 
                        onClick={() => handleDeleteMaterial(mat.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                        title="Xóa tài liệu"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignments list */}
          <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border-color flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-text-main flex items-center gap-2">
                <CheckSquare size={18} className="text-primary"/> Bài tập về nhà
              </h2>
              <button 
                onClick={() => setShowAssignmentModal(true)}
                className="text-sm text-primary font-bold flex items-center gap-1 hover:underline focus:outline-none"
              >
                <Plus size={16}/> Giao bài mới
              </button>
            </div>
            
            <div className="divide-y divide-border-color">
              {assignments.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-body">
                  Chưa giao bài tập nào cho lớp.
                </div>
              ) : (
                assignments.map((assign) => (
                  <div 
                    key={assign.id} 
                    className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/teacher/grading`)}
                  >
                    <div>
                      <p className="font-bold text-text-main text-base">{assign.title}</p>
                      <p className="text-xs text-text-body mt-1">{assign.description}</p>
                      <p className="text-xs text-red-500 font-bold mt-2">
                        Hạn nộp: {formatDateTime(assign.dueDate)}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-xs text-text-body">Điểm tối đa</p>
                        <p className="text-sm font-extrabold text-primary">{assign.maxScore}đ</p>
                      </div>
                      <span className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                        Chấm bài <Send size={12} />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Material Modal */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-border-color shadow-2xl">
            <h3 className="text-xl font-bold text-text-main mb-4">Tải tài liệu giảng dạy lên</h3>
            
            <form onSubmit={handleUploadMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Tên tài liệu *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Slide Lecture 1, Syllabus IELTS..."
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="w-full border border-border-color rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Loại tài liệu</label>
                <select 
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="w-full border border-border-color rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main font-medium"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="DOC">Word Document</option>
                  <option value="VIDEO">Video Lecture</option>
                  <option value="SLIDE">PowerPoint Slide</option>
                  <option value="LINK">External URL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Tệp tài liệu *</label>
                <input 
                  type="file" 
                  required
                  onChange={(e) => setMaterialFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-text-body file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-text-main hover:file:bg-gray-200 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowMaterialModal(false)}
                  disabled={uploadingMaterial}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={uploadingMaterial || !materialFile}
                >
                  {uploadingMaterial ? <Loader2 size={16} className="animate-spin" /> : 'Tải lên'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-border-color shadow-2xl">
            <h3 className="text-xl font-bold text-text-main mb-4">Giao bài tập về nhà</h3>
            
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Tiêu đề bài tập *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Essay Writing Task 1, Vocabulary Practice..."
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="w-full border border-border-color rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Yêu cầu / Mô tả</label>
                <textarea 
                  placeholder="Mô tả đề bài chi tiết..."
                  value={assignmentDescription}
                  onChange={(e) => setAssignmentDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-border-color rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Hạn nộp bài *</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={assignmentDueDate}
                    onChange={(e) => setAssignmentDueDate(e.target.value)}
                    className="w-full border border-border-color rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Điểm tối đa</label>
                  <input 
                    type="number" 
                    min={1}
                    max={100}
                    required
                    value={assignmentMaxScore}
                    onChange={(e) => setAssignmentMaxScore(parseInt(e.target.value))}
                    className="w-full border border-border-color rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAssignmentModal(false)}
                  disabled={creatingAssignment}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={creatingAssignment}
                >
                  {creatingAssignment ? <Loader2 size={16} className="animate-spin" /> : 'Giao bài'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
