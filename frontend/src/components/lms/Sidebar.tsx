import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, FileText, Award, LogOut } from 'lucide-react';
import { dummyUser } from '../../mocks/data';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-accent border-r border-border-color flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-xl">e</span>
          </div>
          <span className="text-2xl font-bold text-primary">ezone</span>
        </div>
        
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Học viên</p>
          <nav className="space-y-1">
            <NavLink to="/student/timetable" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-white text-primary shadow-sm font-medium' : 'text-text-body hover:bg-white/50'}`}>
              <Calendar size={20} />
              Thời khóa biểu
            </NavLink>
            <NavLink to="/student/assignments" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-white text-primary shadow-sm font-medium' : 'text-text-body hover:bg-white/50'}`}>
              <FileText size={20} />
              Tài liệu & Bài tập
            </NavLink>
            <NavLink to="/student/results" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-white text-primary shadow-sm font-medium' : 'text-text-body hover:bg-white/50'}`}>
              <Award size={20} />
              Kết quả học tập
            </NavLink>
          </nav>
        </div>
      </div>
      
      <div className="mt-auto p-6 border-t border-border-color">
        <div className="flex items-center gap-3 mb-4">
          <img src={dummyUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm font-bold text-text-main">{dummyUser.name}</p>
            <p className="text-xs text-text-body">{dummyUser.role}</p>
          </div>
        </div>
        <button className="flex items-center gap-3 text-text-body hover:text-primary transition-colors w-full px-3 py-2 rounded-md hover:bg-white/50">
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};
