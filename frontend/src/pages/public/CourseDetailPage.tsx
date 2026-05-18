import React from 'react';
import { Header } from '../../components/landing/Header';
import { Clock, Users, BookOpen, Star, CheckCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { dummyCourses } from '../../mocks/data';

export const CourseDetailPage: React.FC = () => {
  const course = dummyCourses[0];
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-medium mb-4 inline-block">Bán chạy nhất</span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-300 text-lg mb-6">Trang bị toàn diện 4 kỹ năng Nghe - Nói - Đọc - Viết. Bứt phá điểm số trong thời gian ngắn nhất cùng chuyên gia.</p>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-8">
              <div className="flex items-center gap-2"><Clock size={18} className="text-primary" /> {course.duration}</div>
              <div className="flex items-center gap-2"><Users size={18} className="text-primary" /> {course.students}+ Học viên</div>
              <div className="flex items-center gap-2"><Star size={18} className="text-yellow-400" /> 4.9 Đánh giá</div>
            </div>
            
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Giảng viên" className="w-12 h-12 rounded-full border-2 border-primary" />
              <div>
                <p className="font-medium">Giảng viên: {course.instructor}</p>
                <p className="text-xs text-gray-400">Chuyên gia luyện thi</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-1 shadow-2xl">
            <img src={course.image} alt="Course Preview" className="w-full h-64 object-cover rounded-xl" />
            <div className="p-6 text-gray-900">
              <div className="text-3xl font-bold text-primary mb-6">{course.price}</div>
              <Button className="w-full text-lg py-3 mb-4">Đăng ký học ngay</Button>
              <p className="text-center text-sm text-gray-500">Cam kết hoàn tiền nếu không đạt đầu ra</p>
            </div>
          </div>
        </div>
      </div>
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bạn sẽ học được gì?</h2>
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {['Nắm vững cấu trúc đề thi mới nhất', 'Phản xạ giao tiếp lưu loát, tự nhiên', 'Kỹ thuật đọc hiểu Skimming & Scanning', 'Viết luận học thuật ăn điểm cao'].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lộ trình học tập</h2>
              <div className="space-y-4">
                {[1, 2, 3].map(unit => (
                  <div key={unit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-primary transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-primary flex items-center justify-center font-bold">0{unit}</div>
                      <div>
                        <h3 className="font-bold text-gray-900">Giai đoạn {unit}: Foundation & Skills</h3>
                        <p className="text-sm text-gray-500">4 tuần • 12 buổi học</p>
                      </div>
                    </div>
                    <BookOpen size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
