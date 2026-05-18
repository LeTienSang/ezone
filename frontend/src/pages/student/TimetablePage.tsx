import React from 'react';
import { MapPin, Video, Calendar as CalendarIcon } from 'lucide-react';
import { dummySessions as sessions } from '../../mocks/data';

export const TimetablePage: React.FC = () => {
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
            Tháng 5, 2026
          </div>
        </div>
        <div className="p-0">
          <div className="divide-y divide-border-color">
            {sessions.map(session => (
              <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-6">
                <div className="sm:w-32 flex-shrink-0 text-center sm:text-left">
                  <p className="text-sm font-bold text-primary">{session.date}</p>
                  <p className="text-sm text-text-body mt-1">{session.time}</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-main mb-2">{session.course}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-text-body">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} /> {session.room}
                    </div>
                    {session.link && (
                      <a href={session.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                        <Video size={16} /> Link học trực tuyến
                      </a>
                    )}
                  </div>
                </div>
                <div className="sm:w-24 flex-shrink-0 flex items-center justify-end">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
