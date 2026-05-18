import React from 'react';
import { FileText, Plus, Search, Trash2, Download } from 'lucide-react';
import { dummyMaterials } from '../../mocks/data';
import { Button } from '../../components/common/Button';

export const TeacherMaterialsPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tài liệu</h1>
          <p className="text-gray-500">Tải lên và chia sẻ tài liệu học tập cho các lớp.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus size={18} /> Tải tài liệu lên
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm tài liệu..." 
              className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:border-primary text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary h-10">
            <option>Tất cả lớp học</option>
            <option>IELTS Intensive K45</option>
            <option>Giao tiếp Tiếng Anh K12</option>
          </select>
        </div>
        
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
              {dummyMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${material.type === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {material.type}
                    </div>
                    {material.title}
                  </td>
                  <td className="p-4 text-gray-500">{material.type}</td>
                  <td className="p-4 text-gray-500">{material.id === 1 ? 'IELTS Intensive K45' : 'Tiếng Anh Giao tiếp K12'}</td>
                  <td className="p-4 text-gray-500">{material.uploadedAt}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-2 h-full mt-2">
                    <button className="p-2 text-gray-400 hover:text-primary transition-colors" title="Tải xuống">
                      <Download size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Xóa tài liệu">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
