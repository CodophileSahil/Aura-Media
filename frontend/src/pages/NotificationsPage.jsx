import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead } from '../redux/slices/notificationSlice';
import { Bell, Check, Trash2, ShieldCheck, Clock } from 'lucide-react';

export const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
            <Bell size={24} className="text-brand-500" />
            <span>Platform Alerts Log</span>
          </h1>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
            Review notifications related to file distributions and AI indexing
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="text-xs font-bold text-brand-500 hover:underline flex items-center space-x-1"
          >
            <Check size={14} />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Listings Container */}
      <div className="glass-card rounded-3xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-xl divide-y divide-gray-100 dark:divide-gray-800">
        {loading ? (
          <div className="p-6 text-center text-xs text-gray-400 animate-pulse">Loading alerts logs...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            <ShieldCheck size={32} className="mx-auto text-gray-400 mb-2" />
            <span>You have no notifications.</span>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => dispatch(markAsRead(notif._id))}
              className={`p-5 flex items-start justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-850/20 transition-all ${
                !notif.isRead ? 'bg-brand-500/5 dark:bg-brand-950/5 font-semibold' : ''
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${
                    notif.type === 'success' ? 'bg-green-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-brand-500'
                  }`} />
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{notif.title}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 pl-4">{notif.message}</p>
              </div>
              <div className="text-[10px] text-gray-400 flex items-center space-x-1">
                <Clock size={10} />
                <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
