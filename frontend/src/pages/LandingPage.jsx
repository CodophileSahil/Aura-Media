import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Shield, Sparkles, Activity, Share2, BarChart2 } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b13] transition-colors duration-200">
      {/* Navigation Header */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">🎙️</span>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-brand-500 to-indigo-600 bg-clip-text text-transparent">
            AURA MEDIA
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/about" className="text-sm font-semibold hover:text-brand-500 transition-colors">
            About Project
          </Link>
          <Link to="/login" className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Login
          </Link>
          <Link to="/register" className="text-sm font-semibold gradient-btn px-4 py-2 rounded-lg">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center space-y-8 animate-fadeIn">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-500 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
          <span>Next Generation Content Management</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white max-w-4xl mx-auto">
          AI & Voice-Powered <br />
          <span className="bg-gradient-to-r from-brand-400 to-indigo-500 bg-clip-text text-transparent">
            Media Management
          </span>
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Streamline content workflows using voice actions. Auto-transcribe video/audio, auto-tag images, and leverage secure semantic searches—all within an enterprise-hardened MySQL + React portal.
        </p>

        <div className="flex items-center justify-center space-x-4 pt-4">
          <Link to="/register" className="gradient-btn px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg transform hover:-translate-y-0.5 transition-all">
            Get Started Free
          </Link>
          <Link to="/about" className="px-8 py-3.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-white/50 dark:bg-dark-card/50 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            Technical Specs
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold">Comprehensive Academic Core Modules</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A production-ready architecture showcasing standard design patterns, voice parsing controllers, and database audit logs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-6 rounded-2xl border border-gray-200/40 dark:border-gray-800/40 space-y-4 hover:border-brand-500/50 transition-all">
            <div className="p-3 bg-brand-500/10 rounded-xl text-brand-500 w-12 h-12 flex items-center justify-center">
              <Mic size={24} />
            </div>
            <h3 className="font-bold text-lg">Web Speech Controller</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Listen, parse, and execute operations via natural voice commands. Jump layouts, play files, or run system analytics triggers instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 rounded-2xl border border-gray-200/40 dark:border-gray-800/40 space-y-4 hover:border-indigo-500/50 transition-all">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 w-12 h-12 flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <h3 className="font-bold text-lg">AI Automation Engine</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Auto-generate summaries, tag keywords, output audio scripts, and categorize PDF document texts dynamically.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 rounded-2xl border border-gray-200/40 dark:border-gray-800/40 space-y-4 hover:border-cyan-500/50 transition-all">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500 w-12 h-12 flex items-center justify-center">
              <BarChart2 size={24} />
            </div>
            <h3 className="font-bold text-lg">Advanced Analytics</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Role-oriented stats dashboard showing user counts, file type allocations, engagement trends, and recommendations.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-6 rounded-2xl border border-gray-200/40 dark:border-gray-800/40 space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 w-12 h-12 flex items-center justify-center">
              <Share2 size={24} />
            </div>
            <h3 className="font-bold text-lg">Distribution Control</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Schedule content publication releases, export downloadable items, and produce cryptographically secure temporary sharing links.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-card p-6 rounded-2xl border border-gray-200/40 dark:border-gray-800/40 space-y-4 hover:border-red-500/50 transition-all">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500 w-12 h-12 flex items-center justify-center">
              <Shield size={24} />
            </div>
            <h3 className="font-bold text-lg">Hardened Security</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Route protection middlewares using JWT, password crypting using bcrypt, upload validations, and database activity audit trail logging.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-card p-6 rounded-2xl border border-gray-200/40 dark:border-gray-800/40 space-y-4 hover:border-yellow-500/50 transition-all">
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 w-12 h-12 flex items-center justify-center">
              <Activity size={24} />
            </div>
            <h3 className="font-bold text-lg">Real-Time Sync</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Keep the app status aligned using live Socket.io events. Display notifications instantly upon file uploading or AI pipeline updates.
            </p>
          </div>
        </div>
      </section>

      {/* Footer banner */}
      <footer className="py-12 border-t border-gray-200/50 dark:border-gray-800/50 text-center text-xs text-gray-400 dark:text-gray-600">
        <p>AuraMedia © 2026 - Master of Computer Applications Final Year Project Demonstration</p>
      </footer>
    </div>
  );
};

export default LandingPage;
