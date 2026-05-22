import React, { useEffect, useState } from 'react';
import { FileText, Plus, Search, Trash2, Download, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';

interface ClassEntity {
  id: number;
  className: string;
}

interface Material {
  id: number;
  title: string;
  materialType: string;
  fileUrl: string;
  uploadedAt: string;
  // added manually when mapping
  classId: number;
  className: string;
}

export const TeacherMaterialsPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadClassId, setUploadClassId] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState('PDF');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch classes and initial materials
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const classesRes = await api.get<ClassEntity[]>('/api/v1/classes/my');
      const teacherClasses = classesRes.data || [];
      setClasses(teacherClasses);

      if (teacherClasses.length > 0) {
        setUploadClassId(teacherClasses[0].id.toString());
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Fetch materials whenever classes or selection changes
  useEffect(() => {
    if (classes.length === 0) return;

    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError('');

        let listToFetch = classes;
        if (selectedClassId !== 'all') {
          listToFetch = classes.filter(c => c.id.toString() === selectedClassId);
        }

        const allMaterials: Material[] = [];
        await Promise.all(
          listToFetch.map(async (cls) => {
            try {
              const res = await api.get<any[]>(`/api/v1/classes/${cls.id}/materials`);
              const classMats = (res.data || []).map(m => ({
                ...m,
                classId: cls.id,
                className: cls.className
              }));
              allMaterials.push(...classMats);
            } catch (err) {
              console.error(`Error loading materials for class ${cls.id}`, err);
            }
          })
        );

        // Sort by upload date descending
        allMaterials.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        setMaterials(allMaterials);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Lỗi khi tải danh sách tài liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [classes, selectedClassId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadClassId || !uploadFile || !uploadTitle) return;

    try {
      setUploading(true);
      setError('');
      setSuccessMsg('');

      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle);
      formData.append('materialType', uploadType);

      await api.postForm(`/api/v1/classes/${uploadClassId}/materials`, formData);

      setSuccessMsg('Đăng tải tài liệu thành công!');
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadFile(null);
      
      // Trigger list refresh
      setSelectedClassId('all');
      loadInitialData();
      
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi tải tài liệu lên');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (classId: number, materialId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;

    try {
      setError('');
      await api.delete(`/api/v1/classes/${classId}/materials/${materialId}`);
      setMaterials(prev => prev.filter(m => m.id !== materialId));
      setSuccessMsg('Xóa tài liệu thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi xóa tài liệu');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tài liệu</h1>
          <p className="text-gray-500">Tải lên và chia sẻ tài liệu học tập cho các lớp.</p>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center gap-2"
          onClick={() => setShowUploadModal(true)}
          disabled={classes.length === 0}
        >
          <Plus size={18} /> Tải tài liệu lên
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r text-red-700">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r text-green-700 font-medium">
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm tài liệu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm bg-white text-text-main"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <select 
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary h-10 bg-white text-text-main font-medium"
          >
            <option value="all">Tất cả lớp học</option>
            {classes.map(c => (
              <option key={c.id} value={c.id.toString()}>{c.className}</option>
            ))}
          </select>
        </div>
        
        {loading && materials.length === 0 ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-text-body">Đang tải danh sách tài liệu...</span>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-12 text-center text-text-body">
            Chưa có tài liệu nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-medium">Tên tài liệu</th>
                  <th className="p-4 font-medium">Loại tệp</th>
                  <th className="p-4 font-medium">Lớp học</th>
                  <th className="p-4 font-medium">Ngày tải lên</th>
                  <th className="p-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${material.materialType === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {material.materialType}
                      </div>
                      {material.title}
                    </td>
                    <td className="p-4 text-gray-500">{material.materialType}</td>
                    <td className="p-4 text-gray-500 font-bold">{material.className}</td>
                    <td className="p-4 text-gray-500">{formatDate(material.uploadedAt)}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2 h-full mt-2">
                      <a 
                        href={material.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-gray-400 hover:text-primary transition-colors inline-block" 
                        title="Tải xuống"
                      >
                        <Download size={16} />
                      </a>
                      <button 
                        onClick={() => handleDelete(material.classId, material.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors" 
                        title="Xóa tài liệu"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-gray-200 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tải tài liệu giảng dạy lên</h3>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Chọn lớp học *</label>
                <select 
                  required
                  value={uploadClassId}
                  onChange={(e) => setUploadClassId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-text-main font-medium"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id.toString()}>{c.className}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên tài liệu *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Slide Lecture 1, Reading Syllabus..."
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-text-main"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Loại tài liệu</label>
                <select 
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-text-main font-medium"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="DOC">Word Document</option>
                  <option value="VIDEO">Video Lecture</option>
                  <option value="SLIDE">PowerPoint Slide</option>
                  <option value="LINK">External Link</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tệp tài liệu *</label>
                <input 
                  type="file" 
                  required
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={uploading || !uploadFile}
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : 'Tải lên'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
