import React from 'react';
import { ToggleLeft, Bell, Volume2, Mic, Eye } from 'lucide-react';

export const SettingsPage = () => {
  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">System Settings</h1>
        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
          Configure platform options and voice indicators
        </p>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 space-y-5 shadow-xl">
        {/* Row 1 */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg/60 rounded-2xl">
          <div className="flex items-center space-x-3 text-xs">
            <Mic className="text-brand-500" size={18} />
            <div>
              <p className="font-bold">Voice Synthesis Feedback</p>
              <p className="text-gray-400 text-[10px]">Assistant replies using SpeechSynthesis</p>
            </div>
          </div>
          <span className="text-xs text-green-500 font-bold uppercase">Always On</span>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg/60 rounded-2xl">
          <div className="flex items-center space-x-3 text-xs">
            <Bell className="text-brand-500" size={18} />
            <div>
              <p className="font-bold">Real-time Push Alerts</p>
              <p className="text-gray-400 text-[10px]">Alerts pop up instantly via Websockets</p>
            </div>
          </div>
          <span className="text-xs text-green-500 font-bold uppercase">Always On</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
