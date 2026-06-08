import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { User, Mail, Lock, Shield, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');

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
    if (!username || !email || !password || !role) return;
    dispatch(registerUser({ username, email, password, role }));
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
            Create Account
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Sign up to manage media files and activate voice queries
          </p>
        </div>

        {/* Form Box */}
        <div className="glass-card p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-800/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl p-3 flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 glass-input focus:ring-brand-500/50 focus:border-brand-500 text-sm"
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

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
              <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 glass-input focus:ring-brand-500/50 focus:border-brand-500 text-sm"
                  placeholder="At least 6 characters"
                  required
                />
              </div>
            </div>

            {/* Role Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('viewer')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center space-x-1.5 transition ${
                    role === 'viewer'
                      ? 'bg-brand-500/10 border-brand-500 text-brand-500'
                      : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-800/80'
                  }`}
                >
                  <span>Viewer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center space-x-1.5 transition ${
                    role === 'creator'
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500'
                      : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-800/80'
                  }`}
                >
                  <span>Creator</span>
                </button>
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
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Redirect link */}
        <p className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-500 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
