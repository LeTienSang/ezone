import React from 'react';
import { dummyScores, dummyStudentStats } from '../../mocks/data';

export const ResultsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Kết quả học tập</h1>
        <p className="text-text-body">Tra cứu điểm số và tỷ lệ chuyên cần của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-border-color shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center mb-3">
            <span className="text-xl font-bold text-green-600">{dummyStudentStats.attendance.percentage}</span>
          </div>
          <p className="font-medium text-text-main">Tỷ lệ chuyên cần</p>
          <p className="text-xs text-text-body mt-1">{dummyStudentStats.attendance.details}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border-color shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center mb-3">
            <span className="text-xl font-bold text-primary">{dummyStudentStats.gpa.score}</span>
          </div>
          <p className="font-medium text-text-main">Điểm trung bình</p>
          <p className="text-xs text-text-body mt-1">{dummyStudentStats.gpa.classification}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border-color shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center mb-3">
            <span className="text-xl font-bold text-blue-600">{dummyStudentStats.assignments.submitted}</span>
          </div>
          <p className="font-medium text-text-main">Bài tập đã nộp</p>
          <p className="text-xs text-text-body mt-1">{dummyStudentStats.assignments.details}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        <div className="p-5 border-b border-border-color">
          <h2 className="text-lg font-bold text-text-main">Chi tiết điểm số</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-text-body border-b border-border-color">
              <tr>
                <th className="p-4 font-medium">Tên bài kiểm tra/Bài tập</th>
                <th className="p-4 font-medium">Ngày nộp</th>
                <th className="p-4 font-medium text-center">Điểm</th>
                <th className="p-4 font-medium">Nhận xét của GV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {dummyScores.map((score) => (
                <tr key={score.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-text-main">{score.assignmentName}</td>
                  <td className="p-4 text-text-body">{score.submittedDate}</td>
                  <td className="p-4 font-bold text-primary text-center">{score.score.toFixed(1)}</td>
                  <td className="p-4 text-text-body italic">"{score.feedback}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
