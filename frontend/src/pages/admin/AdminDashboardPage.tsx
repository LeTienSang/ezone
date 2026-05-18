import React from 'react';
import { Users, BookOpen, DollarSign, Activity } from 'lucide-react';
import { dummyAdminStats } from '../../mocks/data';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
        <p className="text-gray-500">Thống kê hoạt động chung của nền tảng ezone.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng người dùng</p>
            <p className="text-2xl font-bold text-gray-900">{dummyAdminStats.totalUsers.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Khóa học</p>
            <p className="text-2xl font-bold text-gray-900">{dummyAdminStats.totalCourses}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Doanh thu</p>
            <p className="text-2xl font-bold text-gray-900">{dummyAdminStats.totalRevenue}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Lớp đang mở</p>
            <p className="text-2xl font-bold text-gray-900">{dummyAdminStats.activeClasses}</p>
          </div>
        </div>
      </div>
      
      {/* Biểu đồ giả lập */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400 mb-4">Biểu đồ người dùng đăng ký mới</p>
          <div className="w-full h-48 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-gray-400">Chart Area</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400 mb-4">Biểu đồ doanh thu hàng tháng</p>
          <div className="w-full h-48 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-gray-400">Chart Area</span>
          </div>
        </div>
      </div>
    </div>
  );
};
