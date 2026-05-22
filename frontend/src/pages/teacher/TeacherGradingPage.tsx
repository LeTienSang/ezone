import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertCircle, Loader2, Download, Save, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';

interface ClassEntity {
  id: number;
  className: string;
}

interface Assignment {
  id: number;
  title: string;
  maxScore: number;
}

interface SubmissionResponse {
  id: number;
  studentId: number;
  studentName: string;
  assignmentId: number;
  assignmentTitle: string;
  content: string;
  fileUrl: string;
  submittedAt: string;
  score: number | null;
  teacherFeedback: string | null;
}

export const TeacherGradingPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');

  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all'); // all, graded, ungraded

  // Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionResponse | null>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Fetch Classes
  useEffect(() => {
    api.get<ClassEntity[]>('/api/v1/classes/my')
      .then(res => {
        const teacherClasses = res.data || [];
        setClasses(teacherClasses);
        if (teacherClasses.length > 0) {
          setSelectedClassId(teacherClasses[0].id.toString());
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Không thể tải danh sách lớp học');
      })
      .finally(() => {
        setLoadingClasses(false);
      });
  }, []);

  // 2. Fetch Assignments when class changes
  useEffect(() => {
    if (!selectedClassId) return;

    setLoadingAssignments(true);
    setAssignments([]);
    setSelectedAssignmentId('');
    setSubmissions([]);

    api.get<Assignment[]>(`/api/v1/classes/${selectedClassId}/assignments`)
      .then(res => {
        const classAssignments = res.data || [];
        setAssignments(classAssignments);
        if (classAssignments.length > 0) {
          setSelectedAssignmentId(classAssignments[0].id.toString());
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Lỗi khi tải bài tập');
      })
      .finally(() => {
        setLoadingAssignments(false);
      });
  }, [selectedClassId]);

  // 3. Fetch Submissions when assignment changes
  useEffect(() => {
    if (!selectedAssignmentId) return;

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get<SubmissionResponse[]>(`/api/v1/assignments/${selectedAssignmentId}/submissions`);
        setSubmissions(res.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Lỗi khi tải bài nộp học viên');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [selectedAssignmentId]);

  const handleOpenGrading = (sub: SubmissionResponse) => {
    setSelectedSubmission(sub);
    setGradeInput(sub.score !== null && sub.score !== undefined ? sub.score.toString() : '');
    setFeedbackInput(sub.teacherFeedback || '');
    setShowGradingModal(true);
  };

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    const scoreNum = parseFloat(gradeInput);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      alert('Điểm số phải nằm trong khoảng từ 0 đến 10');
      return;
    }

    try {
      setSubmittingGrade(true);
      setError('');
      setSuccessMsg('');

      await api.post(`/api/v1/submissions/${selectedSubmission.id}/score`, {
        score: scoreNum,
        teacherFeedback: feedbackInput
      });

      setSuccessMsg(`Chấm điểm thành công cho học viên ${selectedSubmission.studentName}!`);
      setShowGradingModal(false);

      // Refresh list
      const res = await api.get<SubmissionResponse[]>(`/api/v1/assignments/${selectedAssignmentId}/submissions`);
      setSubmissions(res.data || []);

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi chấm điểm bài nộp');
    } finally {
      setSubmittingGrade(false);
    }
  };

  const formatDate = (dateStr: string) => {
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

  // Filter list
  const filteredSubmissions = submissions.filter(sub => {
    const isGraded = sub.score !== null && sub.score !== undefined;
    if (selectedStatus === 'graded') return isGraded;
    if (selectedStatus === 'ungraded') return !isGraded;
    return true;
  });

  const getActiveAssignment = () => {
    return assignments.find(a => a.id.toString() === selectedAssignmentId);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Chấm & Nhận xét</h1>
        <p className="text-text-body">Quản lý bài nộp của học viên và đánh giá kết quả.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r text-red-700 flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r text-green-700 font-medium">
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        <div className="p-4 border-b border-border-color flex flex-wrap gap-4 bg-gray-50">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-body font-semibold">Lớp học:</span>
            {loadingClasses ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <select 
                value={selectedClassId} 
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="border border-border-color rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main font-medium"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id.toString()}>{c.className}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-body font-semibold">Bài tập:</span>
            {loadingAssignments ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <select 
                value={selectedAssignmentId} 
                onChange={(e) => setSelectedAssignmentId(e.target.value)}
                disabled={assignments.length === 0}
                className="border border-border-color rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main font-medium min-w-[200px]"
              >
                {assignments.length === 0 ? (
                  <option value="">Chưa có bài tập nào</option>
                ) : (
                  assignments.map(a => (
                    <option key={a.id} value={a.id.toString()}>{a.title}</option>
                  ))
                )}
              </select>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-body font-semibold">Trạng thái chấm:</span>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-border-color rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main font-medium"
            >
              <option value="all">Tất cả</option>
              <option value="ungraded">Chưa chấm</option>
              <option value="graded">Đã chấm</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-text-body">Đang tải danh sách bài nộp...</span>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-text-body">
            Không tìm thấy bài nộp nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-text-body border-b border-border-color">
                <tr>
                  <th className="p-4 font-medium">Học viên</th>
                  <th className="p-4 font-medium">Bài tập</th>
                  <th className="p-4 font-medium">Ngày nộp</th>
                  <th className="p-4 font-medium text-center">Trạng thái</th>
                  <th className="p-4 font-medium text-center">Điểm số</th>
                  <th className="p-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filteredSubmissions.map((sub) => {
                  const isGraded = sub.score !== null && sub.score !== undefined;
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-text-main">{sub.studentName}</td>
                      <td className="p-4 text-text-body">{sub.assignmentTitle}</td>
                      <td className="p-4 text-text-body">
                        <span className="flex items-center gap-1"><Clock size={14} /> {formatDate(sub.submittedAt)}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${isGraded ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isGraded ? 'Đã chấm' : 'Chưa chấm'}
                        </span>
                      </td>
                      <td className="p-4 text-center font-extrabold text-primary text-base">
                        {isGraded ? `${sub.score}đ` : '-'}
                      </td>
                      <td className="p-4 text-right">
                        <Button 
                          variant={isGraded ? 'outline' : 'primary'} 
                          className="px-3 py-1.5 text-xs font-bold"
                          onClick={() => handleOpenGrading(sub)}
                        >
                          {isGraded ? 'Xem lại' : 'Chấm bài'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 border border-border-color shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-4 border-b border-border-color pb-3">
              <div>
                <h3 className="text-xl font-bold text-text-main">Đánh giá & Chấm bài nộp</h3>
                <p className="text-xs text-text-body mt-1">Học viên: <strong className="text-text-main">{selectedSubmission.studentName}</strong></p>
              </div>
              <span className="text-xs text-text-body font-medium bg-gray-100 px-2 py-1 rounded">
                Nộp lúc: {formatDate(selectedSubmission.submittedAt)}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-bold text-text-main mb-1">Nội dung bài làm:</h4>
                <div className="bg-gray-50 border border-border-color rounded-lg p-4 text-sm text-text-body whitespace-pre-line min-h-[100px]">
                  {selectedSubmission.content || 'Không có nội dung văn bản.'}
                </div>
              </div>

              {selectedSubmission.fileUrl && (
                <div>
                  <h4 className="text-sm font-bold text-text-main mb-1">Tệp đính kèm:</h4>
                  <a 
                    href={selectedSubmission.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline bg-red-50 border border-red-100 px-3 py-2 rounded-lg text-sm"
                  >
                    <Download size={16} /> Tải về bài làm học viên <ExternalLink size={14} />
                  </a>
                </div>
              )}

              <form onSubmit={handleSubmitGrade} className="space-y-4 pt-4 border-t border-border-color">
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-text-main mb-1">Điểm số (0 - 10) *</label>
                    <input 
                      type="number" 
                      step="0.1"
                      min={0}
                      max={10}
                      required
                      placeholder="0.0 - 10.0"
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      className="w-full border border-border-color rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main font-bold"
                    />
                  </div>
                  <div className="col-span-2 text-xs text-text-body pb-2 font-medium">
                    (Điểm tối đa của bài tập này: {getActiveAssignment()?.maxScore || 10} điểm)
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Nhận xét của giảng viên</label>
                  <textarea 
                    placeholder="Viết nhận xét chi tiết, chỉ ra lỗi và hướng cải thiện cho học viên..."
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    rows={4}
                    className="w-full border border-border-color rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-main"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowGradingModal(false)}
                    disabled={submittingGrade}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="flex items-center gap-1.5"
                    disabled={submittingGrade}
                  >
                    {submittingGrade ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Lưu điểm số
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
