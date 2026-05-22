import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUEST'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-4 font-medium">Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to home if user does not have required permissions
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
