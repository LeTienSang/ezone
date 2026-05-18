import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/lms/AdminSidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
