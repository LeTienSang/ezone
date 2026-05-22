import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Loader2, AlertCircle, Award, CheckCircle, Clock, Calendar } from 'lucide-react';

interface StudentScoreResponse {
  className: string;
  assignmentTitle: string;
  maxScore: number;
  score: number;
  teacherFeedback?: string;
  gradedAt?: string;
}

interface StudentAttendanceResponse {
  className: string;
  sessionTitle: string;
  sessionDate: string;
  status: string;
  note?: string;
}

export const ResultsPage: React.FC = () => {
  const [scores, setScores] = useState<StudentScoreResponse[]>([]);
  const [attendance, setAttendance] = useState<StudentAttendanceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'scores' | 'attendance'>('scores');

  useEffect(() => {
    setLoading(true);
    setError('');

    Promise.all([
      api.get<StudentScoreResponse[]>('/api/v1/student/me/scores'),
      api.get<StudentAttendanceResponse[]>('/api/v1/student/me/attendance')
    ])
      .then(([scoresRes, attendanceRes]) => {
        setScores(scoresRes.data || []);
        setAttendance(attendanceRes.data || []);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Không thể tải kết quả học tập');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Calculate dynamic stats
  const totalAttendance = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
  const attendancePercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 100;

  const validScores = scores.filter(s => s.score !== null);
  const gpa = validScores.length > 0
    ? Number((validScores.reduce((sum, s) => sum + s.score, 0) / validScores.length).toFixed(1))
    : 0;

  const getGpaClassification = (gpaVal: number) => {
    if (validScores.length === 0) return 'Chưa xếp loại';
    if (gpaVal >= 9.0) return 'Xuất sắc';
    if (gpaVal >= 8.0) return 'Giỏi';
    if (gpaVal >= 6.5) return 'Khá';
    if (gpaVal >= 5.0) return 'Trung bình';
    return 'Yếu';
  };

  const getAttendanceStatusInfo = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PRESENT':
        return { text: 'Có mặt', class: 'bg-green-100 text-green-800 border border-green-200' };
      case 'ABSENT':
        return { text: 'Vắng mặt', class: 'bg-red-100 text-red-800 border border-red-200' };
      case 'EXCUSED':
        return { text: 'Vắng có phép', class: 'bg-yellow-100 text-yellow-800 border border-yellow-200' };
      case 'LATE':
        return { text: 'Đi muộn', class: 'bg-orange-100 text-orange-800 border border-orange-200' };
      default:
        return { text: status || 'Chưa điểm danh', class: 'bg-gray-100 text-gray-800 border border-gray-200' };
    }
  };

  const formatDate = (dateStr: string, includeTime = false) => {
    try {
      const date = new Date(dateStr);
      if (includeTime) {
        return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="ml-3 text-text-body font-medium">Đang tải kết quả học tập...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Kết quả học tập</h1>
        <p className="text-text-body">Tra cứu điểm số và tỷ lệ chuyên cần của bạn.</p>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-border-color shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-green-600">{attendancePercentage}%</span>
              </div>
              <p className="font-medium text-text-main">Tỷ lệ chuyên cần</p>
              <p className="text-xs text-text-body mt-1">Đã học {presentCount}/{totalAttendance} buổi</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-border-color shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-primary">{gpa}</span>
              </div>
              <p className="font-medium text-text-main">Điểm trung bình</p>
              <p className="text-xs text-text-body mt-1">Xếp loại: {getGpaClassification(gpa)}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border-color shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-blue-600">{scores.length}</span>
              </div>
              <p className="font-medium text-text-main">Bài tập đã chấm</p>
              <p className="text-xs text-text-body mt-1">Tổng số bài tập đã có điểm</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border-color mb-6 gap-2">
            <button
              onClick={() => setActiveTab('scores')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'scores'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-body hover:text-text-main'
              }`}
            >
              Chi tiết Điểm số
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'attendance'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-body hover:text-text-main'
              }`}
            >
              Lịch sử Điểm danh
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'scores' ? (
            <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-text-body border-b border-border-color">
                    <tr>
                      <th className="p-4 font-semibold">Lớp học</th>
                      <th className="p-4 font-semibold">Tên bài tập/Bài kiểm tra</th>
                      <th className="p-4 font-semibold text-center">Điểm</th>
                      <th className="p-4 font-semibold">Ngày chấm</th>
                      <th className="p-4 font-semibold">Nhận xét của GV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color">
                    {scores.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-text-body">
                          Bạn chưa có điểm số nào được ghi nhận.
                        </td>
                      </tr>
                    ) : (
                      scores.map((score, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-text-main font-medium">{score.className}</td>
                          <td className="p-4 text-text-main">{score.assignmentTitle}</td>
                          <td className="p-4 text-center">
                            <span className="font-bold text-primary bg-primary/5 px-2.5 py-1 rounded border border-primary/10">
                              {score.score.toFixed(1)} / {score.maxScore}
                            </span>
                          </td>
                          <td className="p-4 text-text-body text-xs">
                            {score.gradedAt ? formatDate(score.gradedAt, true) : 'N/A'}
                          </td>
                          <td className="p-4 text-text-body italic">
                            {score.teacherFeedback ? `"${score.teacherFeedback}"` : <span className="text-gray-400">Không có nhận xét</span>}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-text-body border-b border-border-color">
                    <tr>
                      <th className="p-4 font-semibold">Lớp học</th>
                      <th className="p-4 font-semibold">Buổi học / Tiêu đề</th>
                      <th className="p-4 font-semibold">Thời gian</th>
                      <th className="p-4 font-semibold text-center">Trạng thái</th>
                      <th className="p-4 font-semibold">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color">
                    {attendance.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-text-body">
                          Chưa có lịch sử điểm danh nào.
                        </td>
                      </tr>
                    ) : (
                      attendance.map((record, index) => {
                        const statusInfo = getAttendanceStatusInfo(record.status);
                        return (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-text-main font-medium">{record.className}</td>
                            <td className="p-4 text-text-main">{record.sessionTitle}</td>
                            <td className="p-4 text-text-body text-xs">{formatDate(record.sessionDate, true)}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${statusInfo.class}`}>
                                {statusInfo.text}
                              </span>
                            </td>
                            <td className="p-4 text-text-body italic">
                              {record.note || <span className="text-gray-400">-</span>}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
