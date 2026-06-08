import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Sun, Moon, LogOut, Radio, User, ChevronDown, Check } from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';
import { fetchNotifications, markAsRead, markAllAsRead, addLiveNotification } from '../../redux/slices/notificationSlice';
import io from 'socket.io-client';

export const Header = ({ isDarkMode, setIsDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Initialize socket.io inside Header to capture alerts live
  useEffect(() => {
    if (!user) return;

    // Load initial database notifications
    dispatch(fetchNotifications());

    const socket = io(window.location.origin);

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('register_user', user._id);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('notification', (notification) => {
      dispatch(addLiveNotification(notification));
    });

    return () => {
      socket.disconnect();
    };
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login');
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200/80 dark:border-gray-800/80 px-6 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🎙️</span>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-500 to-indigo-600 bg-clip-text text-transparent">
            AURA MEDIA
          </span>
        </Link>
        {/* Socket status badge */}
        <span className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full ${socketConnected ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'}`}>
          <Radio size={12} className={socketConnected ? 'animate-pulse' : ''} />
          <span>{socketConnected ? 'Live' : 'Connecting'}</span>
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications Icon and Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-xl bg-white dark:bg-[#161e2f] border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllAsRead())}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
                  >
                    <Check size={12} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-850">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-400 dark:text-gray-500">
                    No new alerts.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => dispatch(markAsRead(notif._id))}
                      className={`px-4 py-3 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${!notif.isRead ? 'bg-brand-50/20 dark:bg-brand-950/10 font-medium' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`font-semibold ${notif.type === 'success' ? 'text-green-500' : notif.type === 'warning' ? 'text-amber-500' : notif.type === 'danger' ? 'text-red-500' : 'text-blue-500'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <img
                src={user.profileImage}
                alt={user.username}
                className="w-7 h-7 rounded-full border border-brand-500/30"
              />
              <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.username}
              </span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white dark:bg-[#161e2f] border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden z-50 py-1">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-850">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 uppercase">
                    {user.role}
                  </span>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                >
                  <User size={14} />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
