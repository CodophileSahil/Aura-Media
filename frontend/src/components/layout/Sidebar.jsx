import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  FolderOpen,
  UploadCloud,
  Search,
  Users,
  History,
  User,
  Settings,
  HelpCircle
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  // Base navigation visible to all roles
  const baseNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Media Library', path: '/library', icon: FolderOpen },
    { name: 'Smart Search', path: '/search', icon: Search },
  ];

  // Role-specific extensions
  const creatorNav = [
    { name: 'Upload Media', path: '/upload', icon: UploadCloud },
  ];

  const adminNav = [
    { name: 'Upload Media', path: '/upload', icon: UploadCloud },
    { name: 'User Directory', path: '/users', icon: Users },
    { name: 'System Logs', path: '/logs', icon: History },
  ];

  const footerNav = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'About Project', path: '/about', icon: HelpCircle },
  ];

  // Merge navigation links based on user role
  const activeNav = [
    ...baseNav,
    ...(user.role === 'admin' ? adminNav : user.role === 'creator' ? creatorNav : []),
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col bg-white dark:bg-[#0f1524] border-r border-gray-200/80 dark:border-gray-800/80 min-h-[calc(100vh-65px)]">
      {/* Navigation Groups */}
      <div className="flex-1 px-4 py-6 space-y-7">
        <div>
          <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-3">
            Main Platform
          </p>
          <nav className="space-y-1.5">
            {activeNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-500 dark:bg-brand-500/20'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-850/50 hover:text-gray-900 dark:hover:text-gray-200'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-3">
            Configuration
          </p>
          <nav className="space-y-1.5">
            {footerNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-500 dark:bg-brand-500/20'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-850/50 hover:text-gray-900 dark:hover:text-gray-200'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Role Tag Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-850/50 rounded-xl p-3 flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse-slow" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
              {user.username}
            </p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
              {user.role} role
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
