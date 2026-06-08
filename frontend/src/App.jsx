import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/slices/authSlice';

// Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import VoiceAssistantButton from './components/ui/VoiceAssistantButton';

// Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminManagementPage from './pages/AdminManagementPage';

// Protected Route Component
const ProtectedRoute = ({ isAuthenticated, loading }) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg">
        <span className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Admin Protection Component
const AdminRoute = ({ role }) => {
  return role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

// Layout for Logged In Users
const AuthenticatedLayout = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-dark-bg">
          <Outlet />
        </main>
      </div>
      {/* Floating Voice Assistant Button made available globally */}
      <VoiceAssistantButton />
    </div>
  );
};

export const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Fetch credentials when component mounts
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected Authenticated Routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} loading={loading} />}>
          <Route element={<AuthenticatedLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/library" element={<MediaLibraryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Creator & Admin uploads */}
            <Route path="/upload" element={<UploadPage />} />

            {/* Admin only subroutes */}
            <Route element={<AdminRoute role={user?.role} />}>
              <Route path="/users" element={<AdminManagementPage />} />
              <Route path="/logs" element={<AdminManagementPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
