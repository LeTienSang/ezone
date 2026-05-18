import React from 'react';
import { Header } from '../../components/landing/Header';
import { CourseCard } from '../../components/landing/CourseCard';
import { dummyCourses } from '../../mocks/data';
import { Search, Filter } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="bg-accent py-12 border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-text-main mb-4">Khám phá Khóa học</h1>
          <p className="text-lg text-text-body max-w-2xl mx-auto">Tìm kiếm khóa học phù hợp với mục tiêu của bạn từ hàng chục khóa học chất lượng cao trên ezone.</p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-border-color">
            <div className="w-full md:w-96 relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên khóa học..." 
                className="w-full h-10 pl-10 pr-4 rounded-md border border-border-color focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <button className="flex items-center gap-2 text-text-body hover:text-primary transition-colors px-4 py-2 border border-border-color rounded-md">
              <Filter size={18} />
              Bộ lọc
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tái sử dụng dummyCourses */}
            {dummyCourses.map(course => (
              <CourseCard key={course.id} {...course} />
            ))}
            {/* Copy thêm vài cái để trang trông đầy đặn */}
            {dummyCourses.map(course => (
              <CourseCard key={course.id + 'dup'} {...course} title={course.title + ' (Cơ bản)'} />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-border-color py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">© 2026 ezone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
