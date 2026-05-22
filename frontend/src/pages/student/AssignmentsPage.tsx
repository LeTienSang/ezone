import React, { useEffect, useState } from 'react';
import { FileText, Download, Upload, Clock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

interface CourseCatalog {
  id: number;
  courseName: string;
  thumbnail?: string;
}

interface ClassEntity {
  id: number;
  className: string;
  course: CourseCatalog;
}

interface Material {
  id: number;
  title: string;
  fileUrl: string;
  materialType: 'PDF' | 'VIDEO' | 'LINK' | 'DOC';
}

interface AssignmentResponse {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submissionStatus: 'submitted' | 'pending';
}

export const AssignmentsPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  
  const [classesLoading, setClassesLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Submission form state
  const [activeSubmittingId, setActiveSubmittingId] = useState<number | null>(null);
  const [submitContent, setSubmitContent] = useState('');
  const [submitFile, setSubmitFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');
  const [submitErrorMsg, setSubmitErrorMsg] = useState('');

  // Fetch student classes on mount
  useEffect(() => {
    api.get<ClassEntity[]>('/api/v1/classes/my')
      .then(res => {
        const list = res.data || [];
        setClasses(list);
        if (list.length > 0) {
          setSelectedClassId(list[0].id);
        }
      })
      .catch(err => {
        setError(err.message || 'Không thể tải danh sách lớp học');
      })
      .finally(() => {
        setClassesLoading(false);
      });
  }, []);

  // Fetch materials and assignments when selected class changes
  useEffect(() => {
    if (!selectedClassId) return;

    setContentLoading(true);
    setError('');
    
    Promise.all([
      api.get<Material[]>(`/api/v1/classes/${selectedClassId}/materials`),
      api.get<AssignmentResponse[]>(`/api/v1/classes/${selectedClassId}/assignments`)
    ])
      .then(([mRes, aRes]) => {
        setMaterials(mRes.data || []);
        setAssignments(aRes.data || []);
      })
      .catch(err => {
        setError(err.message || 'Không thể tải tài liệu & bài tập của lớp học này');
      })
      .finally(() => {
        setContentLoading(false);
      });
  }, [selectedClassId]);

  const getMaterialBadgeInfo = (type: string) => {
    switch (type) {
      case 'PDF':
        return { text: 'PDF', bg: 'bg-red-50 text-red-600 border border-red-200' };
      case 'VIDEO':
        return { text: 'VID', bg: 'bg-purple-50 text-purple-600 border border-purple-200' };
      case 'LINK':
        return { text: 'LNK', bg: 'bg-blue-50 text-blue-600 border border-blue-200' };
      case 'DOC':
      default:
        return { text: 'DOC', bg: 'bg-green-50 text-green-600 border border-green-200' };
    }
  };

  const getFileUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url;
  };

  const formatDueDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const handleOpenSubmit = (assignmentId: number) => {
    setActiveSubmittingId(assignmentId);
    setSubmitContent('');
    setSubmitFile(null);
    setSubmitSuccessMsg('');
    setSubmitErrorMsg('');
  };

  const handleSubmitAssignment = async (e: React.FormEvent, assignmentId: number) => {
    e.preventDefault();
    if (!submitFile && !submitContent.trim()) {
      setSubmitErrorMsg('Vui lòng chọn file nộp bài hoặc viết câu trả lời.');
      return;
    }

    setSubmitting(true);
    setSubmitErrorMsg('');
    setSubmitSuccessMsg('');

    try {
      const formData = new FormData();
      if (submitFile) {
        formData.append('file', submitFile);
      }
      if (submitContent) {
        formData.append('content', submitContent);
      }

      await api.postForm(`/api/v1/assignments/${assignmentId}/submissions`, formData);
      setSubmitSuccessMsg('Nộp bài tập thành công!');
      
      // Refresh assignments list
      const aRes = await api.get<AssignmentResponse[]>(`/api/v1/classes/${selectedClassId}/assignments`);
      setAssignments(aRes.data || []);
      
      // Close form after delay
      setTimeout(() => {
        setActiveSubmittingId(null);
      }, 1500);
    } catch (err: any) {
      setSubmitErrorMsg(err.message || 'Có lỗi xảy ra khi nộp bài.');
    } finally {
      setSubmitting(false);
    }
  };

  if (classesLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="ml-3 text-text-body font-medium">Đang tải dữ liệu lớp học...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Tài liệu & Bài tập</h1>
          <p className="text-text-body">Tải tài liệu học tập và nộp bài tập về nhà.</p>
        </div>
        
        {classes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-body">Lớp học:</span>
            <select
              value={selectedClassId || ''}
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
              className="bg-white border border-border-color rounded-lg px-3 py-2 text-sm font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.className} ({cls.course.courseName})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-border-color p-12 text-center text-text-body">
          <p className="font-medium text-lg text-text-main mb-2">Bạn chưa tham gia lớp học nào</p>
          <p className="text-sm">Hãy hoàn tất đăng ký khóa học và đóng học phí để được xếp lớp.</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : contentLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-text-body">Đang tải tài liệu và bài tập...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Kho tài liệu */}
          <div>
            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <FileText className="text-primary" size={20} /> Tài liệu lớp học
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-border-color divide-y divide-border-color">
              {materials.length === 0 ? (
                <div className="p-8 text-center text-text-body text-sm">
                  Lớp học chưa có tài liệu nào được tải lên.
                </div>
              ) : (
                materials.map((material) => {
                  const badge = getMaterialBadgeInfo(material.materialType);
                  return (
                    <div key={material.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-xs uppercase ${badge.bg}`}>
                          {badge.text}
                        </div>
                        <div>
                          <p className="font-medium text-text-main text-sm">{material.title}</p>
                          <p className="text-xs text-text-body">Tài liệu học tập</p>
                        </div>
                      </div>
                      <a
                        href={getFileUrl(material.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-gray-400 hover:text-primary transition-colors border border-border-color rounded-lg bg-gray-50 hover:bg-white"
                        title="Tải tài liệu / Xem liên kết"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bài tập */}
          <div>
            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <FileText className="text-primary" size={20} /> Bài tập về nhà
            </h2>
            <div className="space-y-4">
              {assignments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-border-color p-8 text-center text-text-body text-sm">
                  Không có bài tập nào được giao.
                </div>
              ) : (
                assignments.map((assignment) => {
                  const isSubmitted = assignment.submissionStatus === 'submitted';
                  return (
                    <div key={assignment.id} className={`bg-white rounded-xl shadow-sm border border-border-color p-5 transition-all ${isSubmitted ? 'opacity-85 border-green-200 bg-green-50/10' : ''}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-text-main text-base">{assignment.title}</h3>
                          <span className="text-xs text-text-body block mt-0.5">Điểm tối đa: {assignment.maxScore}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${isSubmitted ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                          {isSubmitted ? 'Đã nộp' : 'Chưa nộp'}
                        </span>
                      </div>
                      {assignment.description && (
                        <p className="text-sm text-text-body mb-4 bg-gray-50 p-3 rounded-lg border border-border-color/60">{assignment.description}</p>
                      )}
                      
                      {assignment.dueDate && (
                        <div className="flex items-center gap-2 text-sm text-red-500 mb-4 font-medium">
                          <Clock size={16} /> Hạn nộp: {formatDueDate(assignment.dueDate)}
                        </div>
                      )}

                      {!isSubmitted ? (
                        activeSubmittingId === assignment.id ? (
                          <form onSubmit={(e) => handleSubmitAssignment(e, assignment.id)} className="mt-4 p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-text-main mb-1.5 uppercase">Lời nhắn / Bài giải (Text)</label>
                              <textarea
                                value={submitContent}
                                onChange={(e) => setSubmitContent(e.target.value)}
                                placeholder="Nhập câu trả lời hoặc lời nhắn..."
                                className="w-full bg-white border border-border-color rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                rows={3}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-bold text-text-main mb-1.5 uppercase">Đính kèm file (PDF, Word, Image, Zip)</label>
                              <input
                                type="file"
                                onChange={(e) => setSubmitFile(e.target.files ? e.target.files[0] : null)}
                                className="w-full text-sm text-text-body file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                              />
                            </div>

                            {submitErrorMsg && (
                              <div className="text-red-500 text-xs font-medium flex items-center gap-1">
                                <AlertCircle size={14} /> {submitErrorMsg}
                              </div>
                            )}

                            {submitSuccessMsg && (
                              <div className="text-green-600 text-xs font-bold flex items-center gap-1 animate-pulse">
                                <CheckCircle size={14} /> {submitSuccessMsg}
                              </div>
                            )}

                            <div className="flex gap-2 justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                className="text-xs py-1.5"
                                onClick={() => setActiveSubmittingId(null)}
                                disabled={submitting}
                              >
                                Hủy
                              </Button>
                              <Button
                                type="submit"
                                variant="primary"
                                className="text-xs py-1.5"
                                disabled={submitting}
                              >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xác nhận nộp'}
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <Button
                            variant="primary"
                            className="w-full text-sm"
                            onClick={() => handleOpenSubmit(assignment.id)}
                          >
                            <Upload size={16} className="mr-2" /> Nộp bài tập
                          </Button>
                        )
                      ) : (
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-100 text-xs font-medium flex items-center gap-2 justify-center">
                          <CheckCircle size={16} /> Bạn đã hoàn thành bài tập này.
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
