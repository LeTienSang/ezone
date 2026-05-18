import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/lms/Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
