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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
