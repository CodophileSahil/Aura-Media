import React from 'react';
import { Link } from 'react-router-dom';
import { Database, HardDrive, Cpu, Terminal, Layers, ArrowLeft } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b13] p-6">
      {/* Header wrapper */}
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-brand-500 transition-colors uppercase">
          <ArrowLeft size={14} />
          <span>Back to Landing</span>
        </Link>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Smart Voice Activated Media platform
          </h1>
          <p className="text-sm text-brand-500 font-bold uppercase tracking-widest">
            MCA Final-Year Capstone Project Specifications
          </p>
        </div>

        {/* Technical overview list */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-3">
            <div className="flex items-center space-x-2.5 font-bold text-base">
              <Layers className="text-brand-500" size={20} />
              <span>Full-Stack SQL Architecture (React + Node + MySQL)</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Implemented in Model-View-Controller (MVC) structure using relational mapping. Separates database storage controllers, routers, security checks, client views, and socket notification channels.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-3">
            <div className="flex items-center space-x-2.5 font-bold text-base">
              <Cpu className="text-brand-500" size={20} />
              <span>AI / NLP Intent Processors</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Integrates with Web Speech API for instant client voice recognition. Processes commands on a local text classifier to trigger page transfers or file changes.
            </p>
          </div>
        </div>

        {/* Technologies Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">System Specifications</h2>
          
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white/50 dark:bg-dark-card/50">
            <div className="grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800 text-center">
              <div className="p-4 space-y-1">
                <Terminal size={20} className="mx-auto text-brand-500" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">Frontend</p>
                <p className="text-xs font-semibold">React, Vite, Redux, Tailwind</p>
              </div>
              <div className="p-4 space-y-1">
                <Database size={20} className="mx-auto text-brand-500" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">Backend</p>
                <p className="text-xs font-semibold">Node.js, Express.js</p>
              </div>
              <div className="p-4 space-y-1">
                <HardDrive size={20} className="mx-auto text-brand-500" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">Database</p>
                <p className="text-xs font-semibold">MySQL, Sequelize ORM</p>
              </div>
              <div className="p-4 space-y-1">
                <Cpu size={20} className="mx-auto text-brand-500" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">AI Processing</p>
                <p className="text-xs font-semibold">OpenAI API, Regex NLP Parser</p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Project Scope */}
        <div className="glass-card p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-3">
          <h3 className="font-bold text-lg">Demonstration Features & Viva Guide</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            This platform contains comprehensive logs and reports. To demonstrate voice interaction:
          </p>
          <ul className="text-xs text-gray-500 dark:text-gray-400 list-decimal list-inside space-y-2 pl-2">
            <li>Ensure microphone permissions are enabled in your browser window.</li>
            <li>Click the floating microphone icon in the bottom right corner of the dashboard pages.</li>
            <li>Speak commands like <code className="px-1.5 py-0.5 rounded bg-gray-150 dark:bg-gray-800 font-mono text-brand-400">"Open Library"</code> or <code className="px-1.5 py-0.5 rounded bg-gray-150 dark:bg-gray-800 font-mono text-brand-400">"Open Dashboard"</code>.</li>
            <li>Aura AI will confirm using voice synthesis and automatically transition pages.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
