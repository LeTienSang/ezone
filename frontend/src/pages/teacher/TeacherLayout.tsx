import React from 'react';
import { Outlet } from 'react-router-dom';
import { TeacherSidebar } from '../../components/lms/TeacherSidebar';

export const TeacherLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <TeacherSidebar />
      <main className="flex-1 ml-64 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
