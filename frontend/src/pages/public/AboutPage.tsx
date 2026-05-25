import React from 'react';
import { Header } from '../../components/landing/Header';

const aboutContent = {
  title: "Về ezone",
  mission: "Sứ mệnh của chúng tôi là mang đến nền tảng học tập trực tuyến chất lượng cao, dễ tiếp cận và hiệu quả nhất cho mọi người.",
  vision: "Trở thành hệ thống LMS hàng đầu, kết nối hàng triệu học viên với những giảng viên xuất sắc nhất.",
  coreValues: [
    { title: "Chất lượng", description: "Cam kết chất lượng giảng dạy và nội dung học tập tốt nhất." },
    { title: "Sáng tạo", description: "Không ngừng đổi mới phương pháp giáo dục trực tuyến." },
    { title: "Tận tâm", description: "Luôn đồng hành và hỗ trợ học viên trên mọi bước đường." }
  ]
};

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="bg-accent py-20 border-b border-border-color overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-pink-200 opacity-50 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-main mb-6">{aboutContent.title}</h1>
          <p className="text-lg text-text-body max-w-3xl mx-auto">
            Hệ thống quản lý khóa học và đào tạo trực tuyến dành cho các trung tâm giáo dục.
          </p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Sứ mệnh</h2>
              <p className="text-lg text-text-body leading-relaxed">
                {aboutContent.mission}
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Mission" 
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-row-reverse mb-24">
            <div className="order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Vision" 
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-primary mb-6">Tầm nhìn</h2>
              <p className="text-lg text-text-body leading-relaxed">
                {aboutContent.vision}
              </p>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-main mb-4">Giá trị cốt lõi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {aboutContent.coreValues.map((value, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-border-color">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-4">{value.title}</h3>
                  <p className="text-text-body">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-border-color py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">© 2026 ezone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
