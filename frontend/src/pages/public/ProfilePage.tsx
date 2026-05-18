import React from 'react';
import { Camera, Save, Key } from 'lucide-react';
import { dummyUser } from '../../mocks/data';
import { Button } from '../../components/common/Button';

export const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        <p className="text-gray-500">Quản lý thông tin bảo mật và cá nhân của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img src={dummyUser.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-gray-50" />
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-red-700 transition-colors">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="font-bold text-gray-900 text-lg">{dummyUser.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{dummyUser.role}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Thông tin cơ bản</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input type="text" defaultValue={dummyUser.name} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input type="tel" defaultValue="0987654321" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" defaultValue="student@ezone.edu.vn" disabled className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="primary" className="flex items-center gap-2"><Save size={18}/> Lưu thay đổi</Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center gap-2">
              <Key size={18} className="text-gray-500" />
              <h3 className="font-bold text-gray-900">Đổi mật khẩu</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu mới</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="outline">Cập nhật mật khẩu</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
