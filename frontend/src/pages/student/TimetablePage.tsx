import React, { useEffect, useState } from 'react';
import { MapPin, Video, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface CourseCatalog {
  id: number;
  courseName: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  thumbnail: string;
}

interface ClassEntity {
  id: number;
  className: string;
  course: CourseCatalog;
}

interface ClassSession {
  id: number;
  classEntity: ClassEntity;
  title: string;
  sessionDate: string;
  room: string;
  content: string;
}

export const TimetablePage: React.FC = () => {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<ClassSession[]>('/api/v1/classes/timetable')
      .then(res => {
        // Sort sessions by date ascending
        const sorted = (res.data || []).sort((a, b) => 
          new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
        );
        setSessions(sorted);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Không thể tải lịch học');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatSessionDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatSessionTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '';
    }
  };

  const isOnlineLink = (room: string) => {
    return room && (room.startsWith('http://') || room.startsWith('https://'));
  };

  const getSessionStatus = (dateStr: string) => {
    const sessionTime = new Date(dateStr).getTime();
    const now = Date.now();
    if (sessionTime < now) {
      return { text: 'Đã diễn ra', class: 'bg-gray-100 text-gray-700' };
    }
    return { text: 'Sắp diễn ra', class: 'bg-green-100 text-green-700' };
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Thời khóa biểu</h1>
        <p className="text-text-body">Theo dõi lịch học các lớp của bạn.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        <div className="p-4 border-b border-border-color bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2 font-medium text-text-main">
            <CalendarIcon size={20} className="text-primary" />
            Lịch học của tôi
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-text-body">Đang tải lịch học...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center text-text-body">
            <p>Bạn chưa có lịch học nào. Vui lòng đăng ký và tham gia lớp học.</p>
          </div>
        ) : (
          <div className="p-0">
            <div className="divide-y divide-border-color">
              {sessions.map(session => {
                const status = getSessionStatus(session.sessionDate);
                const online = isOnlineLink(session.room);
                return (
                  <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-6">
                    <div className="sm:w-32 flex-shrink-0 text-center sm:text-left">
                      <p className="text-sm font-bold text-primary">{formatSessionDate(session.sessionDate)}</p>
                      <p className="text-sm text-text-body mt-1">{formatSessionTime(session.sessionDate)}</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-main mb-1">
                        {session.classEntity?.course?.courseName || 'Khóa học'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">Lớp: {session.classEntity?.className || 'N/A'} - {session.title}</p>
                      {session.content && <p className="text-sm text-text-body mb-3">{session.content}</p>}
                      <div className="flex flex-wrap gap-4 text-sm text-text-body">
                        {online ? (
                          <a href={session.room} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline font-medium">
                            <Video size={16} /> Link học trực tuyến
                          </a>
                        ) : (
                          <div className="flex items-center gap-1">
                            <MapPin size={16} /> Phòng: {session.room || 'Chưa xếp phòng'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="sm:w-24 flex-shrink-0 flex items-center justify-end">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.class}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
