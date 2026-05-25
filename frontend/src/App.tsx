import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { CoursesPage } from './pages/public/CoursesPage';
import { CourseDetailPage } from './pages/public/CourseDetailPage';
import { InstructorsPage } from './pages/public/InstructorsPage';
import { AboutPage } from './pages/public/AboutPage';
import { ProfilePage } from './pages/public/ProfilePage';
import { DashboardLayout } from './pages/student/DashboardLayout';
import { TimetablePage } from './pages/student/TimetablePage';
import { AssignmentsPage } from './pages/student/AssignmentsPage';
import { ResultsPage } from './pages/student/ResultsPage';
import { StudentPaymentPage } from './pages/student/StudentPaymentPage';
import { TeacherLayout } from './pages/teacher/TeacherLayout';
import { TeacherClassesPage } from './pages/teacher/TeacherClassesPage';
import { TeacherClassDetailPage } from './pages/teacher/TeacherClassDetailPage';
import { TeacherMaterialsPage } from './pages/teacher/TeacherMaterialsPage';
import { TeacherGradingPage } from './pages/teacher/TeacherGradingPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminClassesPage } from './pages/admin/AdminClassesPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/instructors" element={<InstructorsPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/student/timetable" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="payments" element={<StudentPaymentPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <TeacherLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/teacher/classes" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="classes" element={<TeacherClassesPage />} />
          <Route path="classes/:id" element={<TeacherClassDetailPage />} />
          <Route path="materials" element={<TeacherMaterialsPage />} />
          <Route path="grading" element={<TeacherGradingPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="classes" element={<AdminClassesPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
