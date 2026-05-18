import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Book, DollarSign, LogOut } from 'lucide-react';
import { dummyAdmin } from '../../mocks/data';

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col fixed left-0 top-0 text-white">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-xl">e</span>
          </div>
          <span className="text-2xl font-bold text-white">ezone Admin</span>
        </div>
        
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quản trị hệ thống</p>
          <nav className="space-y-1">
            <NavLink to="/admin/dashboard" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white shadow-sm font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              <LayoutDashboard size={20} />
              Tổng quan
            </NavLink>
            <NavLink to="/admin/users" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white shadow-sm font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              <Users size={20} />
              Quản lý người dùng
            </NavLink>
            <NavLink to="/admin/courses" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white shadow-sm font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              <Book size={20} />
              Quản lý khóa học
            </NavLink>
            <NavLink to="/admin/payments" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white shadow-sm font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              <DollarSign size={20} />
              Duyệt học phí
            </NavLink>
          </nav>
        </div>
      </div>
      
      <div className="mt-auto p-6 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <img src={dummyAdmin.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm font-bold text-white">{dummyAdmin.name}</p>
            <p className="text-xs text-gray-400">{dummyAdmin.role}</p>
          </div>
        </div>
        <button className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors w-full px-3 py-2 rounded-md hover:bg-gray-800">
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};
