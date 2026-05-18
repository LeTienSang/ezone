import React from 'react';
import { Users, FileText, CheckSquare, Plus, Video } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const TeacherClassDetailPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mb-3 inline-block">Đang diễn ra</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IELTS Intensive K45</h1>
          <p className="text-gray-500 flex items-center gap-4">
            <span>Sĩ số: 25 học viên</span>
            <span>Lịch học: T2, T4 (18:00 - 20:00)</span>
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-red-50">
          <Video size={18} /> Vào phòng học ảo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Điểm danh */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><Users size={18} className="text-primary"/> Điểm danh hôm nay</h2>
            <span className="text-xs text-gray-500">20/05/2026</span>
          </div>
          <div className="p-0 max-h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <span className="font-medium text-sm text-gray-900">Học viên {i}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full border border-green-500 text-green-500 flex items-center justify-center hover:bg-green-50 font-bold text-xs" title="Có mặt">P</button>
                    <button className="w-8 h-8 rounded-full border border-red-500 text-red-500 flex items-center justify-center hover:bg-red-50 font-bold text-xs" title="Vắng">A</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border-t border-gray-200">
            <Button variant="primary" className="w-full text-sm">Lưu điểm danh</Button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {/* Tài liệu */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><FileText size={18} className="text-primary"/> Kho tài liệu</h2>
              <button className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"><Plus size={16}/> Thêm mới</button>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 p-3 rounded-lg flex items-start gap-3 hover:border-primary transition-colors">
                <div className="bg-red-100 text-primary w-10 h-10 rounded flex items-center justify-center font-bold text-xs">PDF</div>
                <div>
                  <p className="font-medium text-sm text-gray-900 line-clamp-1">Slide Bài 1 - Intro</p>
                  <p className="text-xs text-gray-500 mt-1">2 MB • Tải lên hqua</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bài tập */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><CheckSquare size={18} className="text-primary"/> Bài tập về nhà</h2>
              <button className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"><Plus size={16}/> Giao bài</button>
            </div>
            <div className="p-0">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="font-bold text-gray-900">Homework Unit 1</p>
                  <p className="text-xs text-red-500 mt-1">Hạn nộp: 23:59 - 22/05/2026</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">15/25</p>
                  <p className="text-xs text-gray-500">Đã nộp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
