import React from 'react';
import { Header } from '../../components/landing/Header';
import { CourseCard } from '../../components/landing/CourseCard';
import { Button } from '../../components/common/Button';
import { Search } from 'lucide-react';
import { dummyCourses, dummyLandingStats } from '../../mocks/data';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-accent py-16 sm:py-24 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-pink-200 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-red-100 opacity-50 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main leading-tight mb-6">
              Nền tảng học tập trực tuyến <br /> <span className="text-primary">hàng đầu</span>
            </h1>
            <p className="text-lg text-text-body mb-8 max-w-2xl mx-auto md:mx-0">
              Khám phá các khóa học chất lượng cao với đội ngũ giảng viên giàu kinh nghiệm. Bắt đầu hành trình chinh phục tri thức của bạn ngay hôm nay!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button className="px-8 py-3 text-lg">Khám phá khóa học</Button>
              <Button variant="outline" className="px-8 py-3 text-lg bg-white">Nhận tư vấn ngay</Button>
            </div>
            
            <div className="mt-10 flex items-center justify-center md:justify-start gap-8">
              <div>
                <p className="text-3xl font-bold text-primary">{dummyLandingStats.courses}</p>
                <p className="text-sm text-text-body">Khóa học</p>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div>
                <p className="text-3xl font-bold text-primary">{dummyLandingStats.students}</p>
                <p className="text-sm text-text-body">Học viên</p>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div>
                <p className="text-3xl font-bold text-primary">{dummyLandingStats.rating}</p>
                <p className="text-sm text-text-body">Đánh giá</p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Học tập trực tuyến" 
              className="rounded-2xl shadow-2xl w-full object-cover h-[450px] relative z-10"
            />
            {/* Decorative dots behind image */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary rounded-xl -z-0 opacity-10"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[radial-gradient(#CE1835_2px,transparent_2px)] [background-size:16px_16px] opacity-20 z-0"></div>
          </div>
        </div>
      </section>

      {/* Course Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-text-main mb-2">Khóa học nổi bật</h2>
              <p className="text-text-body text-lg">Các khóa học được học viên đánh giá cao nhất</p>
            </div>
            <div className="w-full md:w-auto relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm khóa học..." 
                className="w-full md:w-80 h-12 pl-12 pr-4 rounded-full border border-border-color focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyCourses.map(course => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="px-8 py-3 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">Xem tất cả khóa học</Button>
          </div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="bg-white border-t border-border-color py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">e</span>
            </div>
            <span className="text-xl font-bold text-primary">ezone</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 ezone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
