import React from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">User Profile</h1>
        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
          Verify your account access privileges
        </p>
      </div>

      {/* Main card */}
      <div className="glass-card p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-150 dark:border-gray-800">
          <img
            src={user.profileImage}
            alt={user.username}
            className="w-20 h-20 rounded-full border-2 border-brand-500 shadow-md"
          />
          <div className="text-center sm:text-left space-y-1.5">
            <h2 className="text-xl font-bold">{user.username}</h2>
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 uppercase tracking-wide">
              {user.role} Privilege
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-4 text-sm">
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
            <Mail size={16} className="text-gray-400" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
              <p className="truncate font-semibold mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
            <Shield size={16} className="text-gray-400" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Account Security Level</p>
              <p className="font-semibold mt-0.5">Role-Based Access Control Activated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
