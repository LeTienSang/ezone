import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, BookOpen, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TeacherSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

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
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Giảng viên</p>
          <nav className="space-y-1">
            <NavLink to="/teacher/classes" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-white text-primary shadow-sm font-medium' : 'text-text-body hover:bg-white/50'}`}>
              <Users size={20} />
              Quản lý lớp học
            </NavLink>
            <NavLink to="/teacher/materials" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-white text-primary shadow-sm font-medium' : 'text-text-body hover:bg-white/50'}`}>
              <BookOpen size={20} />
              Quản lý tài liệu
            </NavLink>
            <NavLink to="/teacher/grading" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-white text-primary shadow-sm font-medium' : 'text-text-body hover:bg-white/50'}`}>
              <CheckSquare size={20} />
              Chấm & Nhận xét
            </NavLink>
            <NavLink to="/teacher/profile" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-white text-primary shadow-sm font-medium' : 'text-text-body hover:bg-white/50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Hồ sơ cá nhân
            </NavLink>
          </nav>
        </div>
      </div>
      
      <div className="mt-auto p-6 border-t border-border-color">
        <div className="flex items-center gap-3 mb-4">
          <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200" />
          <div>
            <p className="text-sm font-bold text-text-main">{user.fullName}</p>
            <p className="text-xs text-text-body">Giảng viên</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-3 text-text-body hover:text-primary transition-colors w-full px-3 py-2 rounded-md hover:bg-white/50">
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};
