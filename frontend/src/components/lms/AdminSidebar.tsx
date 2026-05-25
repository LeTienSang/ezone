import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Book, DollarSign, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <aside className="w-64 h-screen bg-[#0f172a] border-r border-slate-800 flex flex-col fixed left-0 top-0 text-slate-300 font-sans shadow-2xl z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white font-bold text-xl">e</span>
          </div>
          <span className="text-2xl font-bold text-white tracking-wide">ezone<span className="text-primary">.</span></span>
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">Quản lý chung</p>
          <nav className="space-y-1.5">
            <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-slate-800/80 text-white font-medium border-l-[3px] border-primary pl-2 shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 pl-3'}`}>
              <LayoutDashboard size={20} />
              Tổng quan
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-slate-800/80 text-white font-medium border-l-[3px] border-primary pl-2 shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 pl-3'}`}>
              <Users size={20} />
              Người dùng
            </NavLink>
            <NavLink to="/admin/courses" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-slate-800/80 text-white font-medium border-l-[3px] border-primary pl-2 shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 pl-3'}`}>
              <Book size={20} />
              Khóa học
            </NavLink>
            <NavLink to="/admin/classes" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-slate-800/80 text-white font-medium border-l-[3px] border-primary pl-2 shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 pl-3'}`}>
              <Settings size={20} />
              Lớp học
            </NavLink>
            <NavLink to="/admin/payments" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-slate-800/80 text-white font-medium border-l-[3px] border-primary pl-2 shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 pl-3'}`}>
              <DollarSign size={20} />
              Duyệt học phí
            </NavLink>
            <NavLink to="/admin/profile" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-slate-800/80 text-white font-medium border-l-[3px] border-primary pl-2 shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 pl-3'}`}>
              <User size={20} />
              Hồ sơ cá nhân
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800/60 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-5">
          <img src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120"} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-slate-700 bg-gray-700" />
          <div>
            <p className="text-sm font-bold text-white">{user.fullName}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
            </p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all w-full px-3 py-2.5 rounded-lg border border-slate-800">
          <LogOut size={18} />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};
