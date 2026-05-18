import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">e</span>
            </div>
            <h1 className="text-3xl font-bold text-primary">ezone</h1>
          </div>
          <h2 className="text-2xl font-bold text-text-main mt-4">Đăng ký tài khoản</h2>
          <p className="text-sm text-text-body mt-2">Tạo tài khoản học viên mới để bắt đầu.</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Input 
            label="Họ và tên" 
            type="text" 
            placeholder="Nguyễn Văn A" 
            required 
          />

          <Input 
            label="Email" 
            type="email" 
            placeholder="example@gmail.com" 
            required 
          />

          <Input 
            label="Số điện thoại" 
            type="tel" 
            placeholder="0123456789" 
            required 
          />
          
          <div className="relative">
            <Input 
              label="Mật khẩu" 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Nhập mật khẩu" 
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Input 
              label="Xác nhận mật khẩu" 
              type={showConfirmPassword ? 'text' : 'password'} 
              placeholder="Nhập lại mật khẩu" 
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" variant="primary" fullWidth className="mt-2">
            Đăng ký
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-body">
          Bạn đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};
