import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [demoLink, setDemoLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setMessage('');
      setError('');
      setDemoLink('');
      
      const res = await axios.post('/api/auth/forgot-password', { email });
      if (res.data.success) {
        setMessage(res.data.message);
        setDemoLink(res.data.resetUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email recovery request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#070b13] relative overflow-hidden">
      <div className="w-full max-w-md space-y-6 z-10">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block text-3xl">🎙️</Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Recover Password
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl space-y-4">
          {message && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-xl p-4 space-y-2.5">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} />
                <span className="font-bold">Success! Link Generated</span>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed">{message}</p>
              
              {demoLink && (
                <div className="pt-2 border-t border-green-500/10">
                  <p className="text-[9px] uppercase font-bold text-green-600">Demo reset shortcut:</p>
                  <Link to={demoLink} className="block mt-1 text-[10px] font-bold underline text-brand-500 truncate">
                    Click here to Reset Password
                  </Link>
                </div>
              )}
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
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Registered Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 glass-input text-sm"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm gradient-btn flex items-center justify-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Request Reset Link</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs">
          <Link to="/login" className="inline-flex items-center space-x-1 font-bold text-gray-500 hover:text-brand-500">
            <ArrowLeft size={12} />
            <span>Back to Sign In</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
