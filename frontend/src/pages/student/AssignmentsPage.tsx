import React from 'react';
import { FileText, Download, Upload, Clock } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { dummyMaterials, dummyAssignments } from '../../mocks/data';

export const AssignmentsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Tài liệu & Bài tập</h1>
        <p className="text-text-body">Tải tài liệu học tập và nộp bài tập về nhà.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Kho tài liệu */}
        <div>
          <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
            <FileText className="text-primary" size={20} /> Tài liệu lớp học
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-border-color divide-y divide-border-color">
            {dummyMaterials.map((material) => (
              <div key={material.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded flex items-center justify-center font-bold ${material.bgColor} ${material.textColor}`}>
                    {material.type}
                  </div>
                  <div>
                    <p className="font-medium text-text-main">{material.title}</p>
                    <p className="text-xs text-text-body">{material.size} • Tải lên {material.uploadedAt}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                  <Download size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bài tập */}
        <div>
          <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
            <FileText className="text-primary" size={20} /> Bài tập về nhà
          </h2>
          <div className="space-y-4">
            {dummyAssignments.map((assignment) => (
              <div key={assignment.id} className={`bg-white rounded-xl shadow-sm border border-border-color p-5 ${assignment.status === 'Đã nộp' ? 'opacity-75' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-text-main">{assignment.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${assignment.status === 'Đã nộp' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {assignment.status}
                  </span>
                </div>
                {assignment.description && (
                  <p className="text-sm text-text-body mb-4 line-clamp-2">{assignment.description}</p>
                )}
                
                {assignment.deadline && (
                  <div className="flex items-center gap-2 text-sm text-red-500 mb-4 font-medium">
                    <Clock size={16} /> Hạn nộp: {assignment.deadline}
                  </div>
                )}

                {assignment.submittedAt && (
                  <div className="flex items-center gap-2 text-sm text-text-body mb-4">
                    <Clock size={16} /> Đã nộp lúc: {assignment.submittedAt}
                  </div>
                )}

                {assignment.status === 'Chưa nộp' ? (
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 text-sm"><Download size={16} className="mr-2" /> Tải đề</Button>
                    <Button variant="primary" className="flex-1 text-sm"><Upload size={16} className="mr-2" /> Nộp bài</Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full text-sm" disabled>Xem lại bài nộp</Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
