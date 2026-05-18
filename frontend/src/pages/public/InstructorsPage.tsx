import React from 'react';
import { Header } from '../../components/landing/Header';
import { dummyInstructors } from '../../mocks/data';
import { Star, Users } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const InstructorsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="bg-accent py-16 border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-text-main mb-4">Đội ngũ Giảng viên</h1>
          <p className="text-lg text-text-body max-w-2xl mx-auto">Những người thầy, người cô tận tâm sẽ đồng hành cùng bạn chinh phục mọi thử thách tri thức.</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {dummyInstructors.map(instructor => (
              <div key={instructor.id} className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-pink-100 w-full relative">
                  <img 
                    src={instructor.avatar} 
                    alt={instructor.name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white absolute -bottom-16 left-1/2 -translate-x-1/2"
                  />
                </div>
                <div className="pt-20 pb-6 px-6 text-center">
                  <h3 className="text-xl font-bold text-text-main mb-1">{instructor.name}</h3>
                  <p className="text-sm text-primary font-medium mb-4">{instructor.specialty}</p>
                  
                  <div className="flex justify-center gap-6 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span>{instructor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{instructor.students} Học viên</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-body line-clamp-3 mb-6">
                    {instructor.description}
                  </p>
                  
                  <Button variant="outline" fullWidth>Xem hồ sơ</Button>
                </div>
              </div>
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
