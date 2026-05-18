import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { CoursesPage } from './pages/public/CoursesPage';
import { InstructorsPage } from './pages/public/InstructorsPage';
import { AboutPage } from './pages/public/AboutPage';
import { DashboardLayout } from './pages/student/DashboardLayout';
import { TimetablePage } from './pages/student/TimetablePage';
import { AssignmentsPage } from './pages/student/AssignmentsPage';
import { ResultsPage } from './pages/student/ResultsPage';
import { TeacherLayout } from './pages/teacher/TeacherLayout';
import { TeacherClassesPage } from './pages/teacher/TeacherClassesPage';
import { TeacherGradingPage } from './pages/teacher/TeacherGradingPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/instructors" element={<InstructorsPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/student/timetable" replace />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="results" element={<ResultsPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="/teacher/classes" replace />} />
          <Route path="classes" element={<TeacherClassesPage />} />
          <Route path="grading" element={<TeacherGradingPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
