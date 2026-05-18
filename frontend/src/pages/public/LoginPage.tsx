import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

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
          <h2 className="text-2xl font-bold text-text-main mt-4">Đăng nhập vào tài khoản</h2>
          <p className="text-sm text-text-body mt-2">Chào mừng bạn quay trở lại với ezone!</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <Input 
            label="Email hoặc Tên đăng nhập" 
            type="email" 
            placeholder="Nhập email của bạn" 
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-border-color text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-body cursor-pointer">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-hover">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth>
            Đăng nhập
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-color"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
            </div>
          </div>

          <Button type="button" variant="social" fullWidth className="flex justify-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Đăng nhập bằng Google
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-body">
          Bạn chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
