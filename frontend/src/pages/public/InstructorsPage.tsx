import React, { useEffect, useState } from 'react';
import { Header } from '../../components/landing/Header';
import { Star, Users, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

interface InstructorResponse {
  id: number;
  userId: number;
  fullName: string;
  avatar: string | null;
  specialization: string | null;
  experienceYears: number | null;
  bio: string | null;
  rating: number | null;
}

export const InstructorsPage: React.FC = () => {
  const [instructors, setInstructors] = useState<InstructorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await api.get<InstructorResponse[]>('/api/v1/instructors');
        setInstructors(res.data);
      } catch (err: any) {
        console.error('Failed to load instructors:', err);
        setError('Không thể tải danh sách giảng viên.');
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const getAvatar = (inst: InstructorResponse) => {
    if (inst.avatar) return inst.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(inst.fullName)}&background=CE1835&color=fff&size=200`;
  };

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
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Đang tải danh sách giảng viên...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : instructors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Chưa có giảng viên nào.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {instructors.map(instructor => (
                <div key={instructor.id} className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-pink-100 w-full relative">
                    <img 
                      src={getAvatar(instructor)} 
                      alt={instructor.fullName} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white absolute -bottom-16 left-1/2 -translate-x-1/2"
                    />
                  </div>
                  <div className="pt-20 pb-6 px-6 text-center">
                    <h3 className="text-xl font-bold text-text-main mb-1">{instructor.fullName}</h3>
                    <p className="text-sm text-primary font-medium mb-4">{instructor.specialization || 'Giảng viên'}</p>
                    
                    <div className="flex justify-center gap-6 mb-4 text-sm text-gray-500">
                      {instructor.rating != null && (
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-400 fill-current" />
                          <span>{instructor.rating}/5</span>
                        </div>
                      )}
                      {instructor.experienceYears != null && (
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{instructor.experienceYears} năm KN</span>
                        </div>
                      )}
                    </div>
                    
                    {instructor.bio && (
                      <p className="text-sm text-text-body line-clamp-3 mb-6">
                        {instructor.bio}
                      </p>
                    )}
                    
                    <Button variant="outline" fullWidth>Xem hồ sơ</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
