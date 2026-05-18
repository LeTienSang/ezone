import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { dummySubmissions } from '../../mocks/data';
import { Button } from '../../components/common/Button';

export const TeacherGradingPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Chấm & Nhận xét</h1>
        <p className="text-text-body">Quản lý bài nộp của học viên và đánh giá kết quả.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        <div className="p-4 border-b border-border-color flex justify-between items-center bg-gray-50">
          <div className="flex gap-4">
            <select className="border border-border-color rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Tất cả lớp</option>
              <option>IELTS Intensive K45</option>
            </select>
            <select className="border border-border-color rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Trạng thái: Tất cả</option>
              <option>Chưa chấm</option>
              <option>Đã chấm</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-text-body border-b border-border-color">
              <tr>
                <th className="p-4 font-medium">Học viên</th>
                <th className="p-4 font-medium">Bài tập</th>
                <th className="p-4 font-medium">Ngày nộp</th>
                <th className="p-4 font-medium text-center">Trạng thái</th>
                <th className="p-4 font-medium text-center">Điểm số</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {dummySubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-text-main">{sub.studentName}</td>
                  <td className="p-4 text-text-body">{sub.assignment}</td>
                  <td className="p-4 text-text-body">
                    <span className="flex items-center gap-1"><Clock size={14} /> {sub.submittedAt}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${sub.status === 'Đã chấm' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-primary">
                    {sub.score ? sub.score.toFixed(1) : '-'}
                  </td>
                  <td className="p-4 text-right">
                    {sub.status === 'Chưa chấm' ? (
                      <Button variant="primary" className="px-3 py-1 text-xs">Chấm bài</Button>
                    ) : (
                      <button className="text-text-body hover:text-primary text-sm flex items-center justify-end w-full gap-1">
                        <CheckCircle size={16} /> Xem lại
                      </button>
                    )}
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
