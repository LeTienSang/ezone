import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/landing/Header';
import { Clock, Users, BookOpen, X } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface SyllabusItem {
  id: number;
  title: string;
  description: string;
  sortOrder: number;
}

interface CourseCatalog {
  id: number;
  courseName: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  thumbnail?: string;
  syllabus?: SyllabusItem[];
}

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<CourseCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Registration modal states
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!id) return;
      try {
        const res = await api.get<CourseCatalog>(`/api/v1/courses/${id}`);
        setCourse(res.data);
      } catch (err: any) {
        console.error('Failed to load course details:', err);
        setError('Không thể tải thông tin chi tiết khóa học này.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setRegError(null);
    setRegistering(true);
    try {
      const res = await api.post<any>('/api/v1/enrollments', {
        fullName,
        email,
        phone,
        courseId: course.id
      });
      setRegSuccess(true);
      
      if (res.data && res.data.id) {
        localStorage.setItem('pendingEnrollment', JSON.stringify({
          id: res.data.id,
          courseName: course.courseName,
          price: course.price
        }));
      }
      
      setTimeout(() => {
        setShowModal(false);
        setRegSuccess(false);
        // If student is logged in, redirect them to payments page to complete payment
        if (user && user.role === 'STUDENT') {
          navigate('/student/payments');
        }
      }, 2500);
    } catch (err: any) {
      setRegError(err.message || 'Gửi yêu cầu đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        <div className="text-center py-24">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin khóa học...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        <div className="text-center py-24 max-w-xl mx-auto px-4">
          <p className="text-red-500 text-lg font-medium mb-4">{error || 'Không tìm thấy khóa học'}</p>
          <Button onClick={() => navigate('/courses')}>Quay lại danh sách khóa học</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-medium mb-4 inline-block">{course.level || 'All Levels'}</span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.courseName}</h1>
            <p className="text-gray-300 text-lg mb-6">{course.description || 'Trang bị toàn diện kiến thức và kỹ năng. Bứt phá điểm số trong thời gian ngắn nhất cùng chuyên gia.'}</p>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-8">
              <div className="flex items-center gap-2"><Clock size={18} className="text-primary" /> {course.duration || '3 tháng'}</div>
              <div className="flex items-center gap-2"><BookOpen size={18} className="text-primary" /> {course.level || 'All Levels'}</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-primary bg-slate-700 flex items-center justify-center">
                <Users size={22} className="text-white" />
              </div>
              <div>
                <p className="font-medium">Giảng viên ezone</p>
                <p className="text-xs text-gray-400">Đội ngũ chuyên gia đào tạo</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-1 shadow-2xl">
            <img src={course.thumbnail ? (course.thumbnail.startsWith('http') ? course.thumbnail : course.thumbnail) : "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"} alt="Course Preview" className="w-full h-64 object-cover rounded-xl" />
            <div className="p-6 text-gray-900">
              <div className="text-3xl font-bold text-primary mb-6">{course.price ? `${course.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}</div>
              <Button onClick={() => setShowModal(true)} className="w-full text-lg py-3 mb-4">Đăng ký học ngay</Button>
              <p className="text-center text-sm text-gray-500">Cam kết hoàn tiền nếu không đạt đầu ra</p>
            </div>
          </div>
        </div>
      </div>
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Mô tả chi tiết khóa học */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Giới thiệu khóa học</h2>
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm mb-12">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {course.description || 'Thông tin chi tiết khóa học sẽ được cập nhật sớm.'}
                </p>
              </div>

              {/* Lộ trình học tập (Syllabus/Curriculum) */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lộ trình học tập</h2>
              {course.syllabus && course.syllabus.length > 0 ? (
                <div className="relative border-l-2 border-primary/25 ml-4 pl-6 space-y-8 mb-12">
                  {course.syllabus.map((item, index) => (
                    <div key={item.id} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[39px] top-1 flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold ring-4 ring-white shadow-sm">
                        {index + 1}
                      </span>
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-12 text-center text-gray-500">
                  Lộ trình học tập đang được cập nhật.
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin thêm</h2>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <Clock size={20} className="text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Thời lượng</h3>
                    <p className="text-sm text-gray-500">{course.duration || 'Liên hệ để biết thêm'}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <BookOpen size={20} className="text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Trình độ</h3>
                    <p className="text-sm text-gray-500">{course.level || 'All Levels'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng ký học viên</h3>
              <p className="text-sm text-gray-500 mb-6">Vui lòng điền hoặc xác nhận thông tin của bạn để đăng ký khóa học: <strong className="text-gray-700">{course.courseName}</strong></p>
              
              {regSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md text-sm text-center mb-4">
                  Đăng ký thành công! Đang chuyển hướng...
                </div>
              ) : (
                <form onSubmit={handleEnrollSubmit} className="space-y-4">
                  {regError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm text-center">
                      {regError}
                    </div>
                  )}
                  <Input 
                    label="Họ và tên" 
                    type="text" 
                    placeholder="Nguyễn Văn A" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input 
                    label="Email" 
                    type="email" 
                    placeholder="example@gmail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input 
                    label="Số điện thoại" 
                    type="tel" 
                    placeholder="0912345678" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full mt-2" disabled={registering}>
                    {registering ? 'Đang gửi đăng ký...' : 'Xác nhận Đăng ký'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
