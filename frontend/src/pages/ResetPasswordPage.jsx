import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      setLoading(true);
      setMessage('');
      setError('');

      const res = await axios.post('/api/auth/reset-password', { token, password });
      if (res.data.success) {
        setMessage(res.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#070b13] relative overflow-hidden">
      <div className="w-full max-w-md space-y-6 z-10">
        <div className="text-center space-y-2">
          <span className="inline-block text-3xl">🎙️</span>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Create a secure new password for your account
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl space-y-4">
          {message && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-xl p-4 flex items-center space-x-2.5">
              <CheckCircle size={18} />
              <div>
                <p className="font-bold">Password Reset Complete!</p>
                <p className="text-gray-500 mt-0.5">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl p-3 flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 glass-input text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 glass-input text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || message}
              className="w-full py-3.5 rounded-xl font-bold text-sm gradient-btn flex items-center justify-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
