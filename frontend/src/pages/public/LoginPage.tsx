import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

// TypeScript declaration for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = '336942887412-rpl50jr7k3gttk4mu3ld6dut360rf7cn.apps.googleusercontent.com';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleButtonWrapperRef = useRef<HTMLDivElement>(null);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const redirectByRole = (role: string) => {
    if (role === 'ADMIN') {
      navigate('/admin');
    } else if (role === 'TEACHER') {
      navigate('/teacher');
    } else {
      navigate('/student');
    }
  };

  // Initialize Google Sign-In and render the real Google button
  useEffect(() => {
    const initGoogle = () => {
      if (!window.google || !googleButtonWrapperRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          setGoogleLoading(true);
          setError(null);
          try {
            const user = await loginWithGoogle(response.credential);
            redirectByRole(user.role);
          } catch (err: any) {
            setError(err.message || 'Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
            setGoogleLoading(false);
          }
        },
        ux_mode: 'popup',
      });

      // Render Google's official sign-in button inside the wrapper
      window.google.accounts.id.renderButton(googleButtonWrapperRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: googleButtonWrapperRef.current.offsetWidth,
      });
    };

    // If Google script is already loaded, init immediately
    if (window.google) {
      initGoogle();
    } else {
      // Otherwise wait for the script to load
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);
      // Cleanup after 10s to avoid infinite polling
      const timeout = setTimeout(() => clearInterval(interval), 10000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [loginWithGoogle, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      redirectByRole(user.role);
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link to="/" className="flex justify-center items-center gap-2 mb-2 hover:opacity-85 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">e</span>
            </div>
            <h1 className="text-3xl font-bold text-primary">ezone</h1>
          </Link>
          <h2 className="text-2xl font-bold text-text-main mt-4">Đăng nhập vào tài khoản</h2>
          <p className="text-sm text-text-body mt-2">Chào mừng bạn quay trở lại với ezone!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input 
            label="Email" 
            type="email" 
            placeholder="Nhập email của bạn" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          
          <div className="relative">
            <Input 
              label="Mật khẩu" 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Nhập mật khẩu" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-color"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
            </div>
          </div>

          {/* Google Sign-In button rendered by Google Identity Services */}
          <div 
            ref={googleButtonWrapperRef} 
            className="flex justify-center"
            style={{ minHeight: '44px' }}
          />

          {googleLoading && (
            <p className="text-center text-sm text-text-body">Đang xử lý đăng nhập Google...</p>
          )}
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
