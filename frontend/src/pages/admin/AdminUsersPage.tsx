import React, { useEffect, useState } from 'react';
import { Search, ShieldAlert, UserCheck, UserX, Loader2, Plus, Edit } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUEST';
  avatar: string;
  isActive: boolean;
  createdAt: string;
}

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all users. For convenience, fetch a large page size to handle list easily
      const response = await api.get<{ content: User[] }>('/api/v1/users?size=100');
      setUsers(response.data.content || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setEditingUser({ username: '', password: '', email: '', fullName: '', phone: '', role: 'STUDENT', isActive: true });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEdit = (u: any) => {
    setEditingUser({ ...u, password: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      setFormLoading(true);
      if (!editingUser.id) {
        await api.post('/api/v1/users', {
          username: editingUser.username,
          password: editingUser.password,
          email: editingUser.email,
          fullName: editingUser.fullName,
          phone: editingUser.phone,
          role: editingUser.role,
          isActive: editingUser.isActive
        });
      } else {
        await api.put(`/api/v1/users/${editingUser.id}`, {
          password: editingUser.password || undefined,
          email: editingUser.email,
          fullName: editingUser.fullName,
          phone: editingUser.phone,
          role: editingUser.role,
          isActive: editingUser.isActive
        });
      }
      setIsModalOpen(false);
      await fetchUsers();
    } catch (err: any) {
      setFormError(err.message || 'Lỗi khi lưu người dùng');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      setTogglingId(id);
      const res = await api.patch<User>(`/api/v1/users/${id}/toggle-active`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: res.data.isActive } : u));
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra khi cập nhật trạng thái người dùng');
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">Quản trị</span>;
      case 'TEACHER':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-100">Giảng viên</span>;
      case 'STUDENT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">Học viên</span>;
      case 'GUEST':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-100">Khách</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-100">{role}</span>;
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý người dùng</h1>
          <p className="text-gray-500 text-sm mt-1">Phân quyền và quản lý tài khoản trên toàn bộ hệ thống.</p>
        </div>
        <div>
          <Button variant="primary" onClick={openCreate} className="flex items-center gap-2">
            <Plus size={16} /> Thêm người dùng
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, email, tài khoản..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 text-sm transition-all bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="flex gap-2">
            <select 
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 bg-white text-gray-700 font-medium cursor-pointer"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="TEACHER">Giảng viên</option>
              <option value="STUDENT">Học viên</option>
              <option value="GUEST">Khách (Chờ thanh toán)</option>
            </select>
            <Button variant="outline" size="sm" onClick={fetchUsers} className="flex items-center gap-1.5 h-10">
              Tải lại
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-6 text-center text-red-600 bg-red-50 border-b border-red-100 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-gray-400" size={32} />
              <span className="text-gray-500 text-sm">Đang tải danh sách người dùng...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm font-medium">
              Không tìm thấy người dùng nào phù hợp.
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Họ & Tên</th>
                  <th className="p-4">Tài khoản</th>
                  <th className="p-4">Email / SĐT</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Ngày tham gia</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-gray-900">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`} 
                          alt={user.fullName} 
                          className="w-9 h-9 rounded-full object-cover border border-gray-200 bg-gray-100" 
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-400 font-normal">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 font-mono text-xs">{user.username}</td>
                    <td className="p-4">
                      <p className="text-gray-700">{user.email}</p>
                      {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                    </td>
                    <td className="p-4">{getRoleBadge(user.role)}</td>
                    <td className="p-4 text-gray-500 text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                        user.isActive 
                          ? 'bg-green-50 text-green-700 border border-green-150' 
                          : 'bg-red-50 text-red-700 border border-red-150'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {user.isActive ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {togglingId === user.id ? (
                        <div className="inline-block animate-spin text-gray-400 mr-2">
                          <Loader2 size={16} />
                        </div>
                      ) : (
                        <>
                          <button onClick={() => openEdit(user)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mr-2" title="Chỉnh sửa">
                            <Edit size={18} />
                          </button>
                          {user.isActive ? (
                            <button 
                              onClick={() => handleToggleActive(user.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                              title="Khóa tài khoản"
                            >
                              <ShieldAlert size={18} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleToggleActive(user.id)}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" 
                              title="Mở khóa tài khoản"
                            >
                              <UserCheck size={18} />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
        {/* Create / Edit User Modal */}
        {isModalOpen && editingUser && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/80">
                <h2 className="text-lg font-bold text-gray-900">{editingUser.id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-full">✕</button>
              </div>
              <div className="p-6">
                {formError && <div className="mb-3 text-sm text-red-600">{formError}</div>}
                <form onSubmit={handleSave} className="space-y-3">
                  {!editingUser.id && (
                    <div>
                      <label className="block text-xs font-semibold">Tài khoản (username) *</label>
                      <input required value={editingUser.username} onChange={e => setEditingUser((p:any)=>({...p, username: e.target.value}))} className="w-full border rounded px-3 py-2" />
                    </div>
                  )}
                  {!editingUser.id && (
                    <div>
                      <label className="block text-xs font-semibold">Mật khẩu *</label>
                      <input required type="password" value={editingUser.password} onChange={e => setEditingUser((p:any)=>({...p, password: e.target.value}))} className="w-full border rounded px-3 py-2" />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold">Họ & Tên</label>
                    <input value={editingUser.fullName} onChange={e => setEditingUser((p:any)=>({...p, fullName: e.target.value}))} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">Email</label>
                    <input value={editingUser.email} onChange={e => setEditingUser((p:any)=>({...p, email: e.target.value}))} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">Số điện thoại</label>
                    <input value={editingUser.phone} onChange={e => setEditingUser((p:any)=>({...p, phone: e.target.value}))} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">Vai trò</label>
                    <select value={editingUser.role} onChange={e => setEditingUser((p:any)=>({...p, role: e.target.value}))} className="w-full border rounded px-3 py-2">
                      <option value="ADMIN">ADMIN</option>
                      <option value="TEACHER">TEACHER</option>
                      <option value="STUDENT">STUDENT</option>
                      <option value="GUEST">GUEST</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={formLoading}>Hủy</Button>
                    <Button type="submit" variant="primary" disabled={formLoading}>{formLoading ? 'Đang lưu...' : 'Lưu'}</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

