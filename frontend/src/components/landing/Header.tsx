import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">e</span>
              </div>
              <span className="text-2xl font-bold text-primary">ezone</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-text-main hover:text-primary font-medium">Trang chủ</Link>
            <Link to="/courses" className="text-text-body hover:text-primary font-medium">Khóa học</Link>
            <Link to="/instructors" className="text-text-body hover:text-primary font-medium">Giảng viên</Link>
            <Link to="/about" className="text-text-body hover:text-primary font-medium">Về chúng tôi</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">Đăng nhập</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Đăng ký</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
