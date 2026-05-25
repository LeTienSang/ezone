import React, { useState } from 'react';
import { Camera, Save, Key, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      
      setSaving(true);
      setSaveMsg('');
      try {
        const res = await api.postForm<any>('/api/v1/users/me/avatar', formData);
        updateUser(res.data);
        setSaveMsg('Cập nhật ảnh đại diện thành công!');
      } catch (err: any) {
        setSaveMsg(err.message || 'Tải ảnh đại diện thất bại');
      } finally {
        setSaving(false);
      }
    }
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await api.patch<any>('/api/v1/users/me', { fullName, phone });
      updateUser(res.data);
      setSaveMsg('Cập nhật hồ sơ thành công!');
    } catch (err: any) {
      setSaveMsg(err.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg('');
    if (newPassword !== confirmPassword) {
      setPwMsg('Mật khẩu mới không khớp');
      return;
    }
    if (!currentPassword || !newPassword) {
      setPwMsg('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (newPassword.length < 6) {
      setPwMsg('Mật khẩu mới phải từ 6 ký tự trở lên');
      return;
    }
    try {
      await api.patch('/api/v1/users/me/password', {
        currentPassword,
        newPassword,
      });
      setPwMsg('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwMsg(err.message || 'Đổi mật khẩu thất bại');
    }
  };

  const roleLabel = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'TEACHER': return 'Giảng viên';
      case 'STUDENT': return 'Học viên';
      case 'GUEST': return 'Khách';
      default: return role || '';
    }
  };

  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=CE1835&color=fff`;

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
              <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-gray-50" />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-red-700 transition-colors"
              >
                <Camera size={18} />
              </button>
            </div>
            <h2 className="font-bold text-gray-900 text-lg">{user?.fullName}</h2>
            <p className="text-sm text-gray-500 mt-1">{roleLabel(user?.role)}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Thông tin cơ bản</h3>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" defaultValue={user?.email} disabled className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
                </div>
              </div>
              {saveMsg && (
                <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${saveMsg.includes('thành công') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {saveMsg.includes('thành công') && <CheckCircle size={16} />}
                  {saveMsg}
                </div>
              )}
              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary" className="flex items-center gap-2" disabled={saving}>
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18}/>}
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center gap-2">
              <Key size={18} className="text-gray-500" />
              <h3 className="font-bold text-gray-900">Đổi mật khẩu</h3>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                <input type="password" placeholder="••••••••" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu mới</label>
                <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm" />
              </div>
              {pwMsg && (
                <div className={`text-sm p-3 rounded-lg ${pwMsg.includes('thành công') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{pwMsg}</div>
              )}
              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="outline">Cập nhật mật khẩu</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
