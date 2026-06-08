import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../redux/slices/authSlice';
import { Mail, Lock, Shield, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [demoRole, setDemoRole] = useState(null); // quick credential selector for examiners

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  // Quick credentials loader to speed up demonstrations for examiners
  const applyDemoCredentials = (role) => {
    setDemoRole(role);
    if (role === 'admin') {
      setEmail('admin@auramedia.com');
      setPassword('admin123');
    } else if (role === 'creator') {
      setEmail('creator@auramedia.com');
      setPassword('creator123');
    } else {
      setEmail('viewer@auramedia.com');
      setPassword('viewer123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#070b13] relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block text-3xl">🎙️</Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Sign in to access your media files and voice console
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-card p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-800/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl p-3 flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 glass-input focus:ring-brand-500/50 focus:border-brand-500 text-sm"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-bold text-brand-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 glass-input focus:ring-brand-500/50 focus:border-brand-500 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm gradient-btn flex items-center justify-center space-x-2 mt-4"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Selector */}
          <div className="mt-6 border-t border-gray-100 dark:border-gray-800/80 pt-5 space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <div className="flex items-center space-x-1">
                <Sparkles size={12} className="text-brand-500" />
                <span>Demo Accounts</span>
              </div>
              <span>Click to Autofill</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyDemoCredentials('admin')}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition ${
                  demoRole === 'admin' 
                    ? 'bg-brand-500/10 border-brand-500 text-brand-500' 
                    : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-850 hover:bg-gray-50'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => applyDemoCredentials('creator')}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition ${
                  demoRole === 'creator' 
                    ? 'bg-brand-500/10 border-brand-500 text-brand-500' 
                    : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-850 hover:bg-gray-50'
                }`}
              >
                Creator
              </button>
              <button
                onClick={() => applyDemoCredentials('viewer')}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition ${
                  demoRole === 'viewer' 
                    ? 'bg-brand-500/10 border-brand-500 text-brand-500' 
                    : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-850 hover:bg-gray-50'
                }`}
              >
                Viewer
              </button>
            </div>
          </div>
        </div>

        {/* Redirect link */}
        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-500 hover:underline">
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
