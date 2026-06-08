import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Users, HardDrive, BarChart2, MessageSquare, Sparkles, Eye, Download, FileText, CheckCircle, Clock 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import MediaCard from '../components/ui/MediaCard';

export const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data based on role
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/analytics/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching analytics details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  if (!data) return <div className="p-6">Error loading analytics dashboard.</div>;

  const COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="p-6 space-y-8 animate-fadeIn">
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">
          Hello, {user.username}
        </h1>
        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
          Account Role: {user.role} Dashboard
        </p>
      </div>

      {/* ADMIN DASHBOARD */}
      {user.role === 'admin' && (
        <>
          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl flex items-center space-x-4">
              <div className="p-3 bg-brand-500/10 rounded-xl text-brand-500"><Users size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Users</p>
                <h3 className="text-2xl font-bold">{data.metrics.totalUsers}</h3>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500"><HardDrive size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Files</p>
                <h3 className="text-2xl font-bold">{data.metrics.totalUploads}</h3>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex items-center space-x-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500"><Users size={24} className="animate-pulse" /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Active Users</p>
                <h3 className="text-2xl font-bold">{data.metrics.activeUsers}</h3>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><MessageSquare size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Voice Actions</p>
                <h3 className="text-2xl font-bold">{data.metrics.totalVoiceCommands}</h3>
              </div>
            </div>
          </div>

          {/* Admin Analytics Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Timeline Graph */}
            <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-4">
              <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">Upload Metrics History</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.uploadsTimeline}>
                    <defs>
                      <linearGradient id="uploadsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#161e2f', borderColor: '#243049' }} />
                    <Area type="monotone" dataKey="uploads" stroke="#8b5cf6" fillOpacity={1} fill="url(#uploadsGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity distribution Pie chart */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">Activity Breakdown</h3>
              <div className="h-64 flex flex-col justify-center">
                {data.activityBreakdown.length === 0 ? (
                  <p className="text-center text-xs text-gray-400">No actions recorded.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.activityBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.activityBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#161e2f', borderColor: '#243049' }} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Recent Audits Table */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">System Logs Timeline</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-100 dark:bg-gray-800 text-[10px] uppercase font-bold text-gray-400">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Details</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                  {data.recentActivities.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-850/30">
                      <td className="p-3 font-semibold text-gray-700 dark:text-gray-300">{log.user?.username || 'Guest'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.action === 'Login' ? 'bg-green-100 text-green-700' : log.action === 'Upload' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3">{log.details}</td>
                      <td className="p-3 font-mono">{log.ipAddress}</td>
                      <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* CREATOR DASHBOARD */}
      {user.role === 'creator' && (
        <>
          {/* Creator stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl flex items-center space-x-4">
              <div className="p-3 bg-brand-500/10 rounded-xl text-brand-500"><HardDrive size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">My Uploads</p>
                <h3 className="text-2xl font-bold">{data.metrics.myUploads}</h3>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500"><Eye size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Views</p>
                <h3 className="text-2xl font-bold">{data.metrics.views}</h3>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex items-center space-x-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500"><Download size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Downloads</p>
                <h3 className="text-2xl font-bold">{data.metrics.downloads}</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Insights panel */}
            <div className="glass-card p-6 rounded-2xl bg-gradient-to-tr from-brand-900/10 to-indigo-900/10 border border-brand-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-brand-500 mb-4">
                  <Sparkles size={20} className="animate-pulse" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">AI Channel Insight</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{data.metrics.aiInsight}"
                </p>
              </div>
              <div className="mt-6 text-[10px] text-gray-400 flex items-center space-x-1">
                <CheckCircle size={12} className="text-brand-500" />
                <span>Audited automatically based on upload distribution metrics</span>
              </div>
            </div>

            {/* Media allocations graph */}
            <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-4">
              <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">File Type Distributions</h3>
              <div className="h-56">
                {data.mediaDistribution.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-gray-400">
                    No uploads yet. Go to Upload Media to add files.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.mediaDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {data.mediaDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#161e2f', borderColor: '#243049' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Popular uploads listings */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Popular Content Performance</h3>
            {data.popularContent.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No views registered yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.popularContent.map((item) => (
                  <MediaCard key={item._id} item={item} currentUser={user} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* VIEWER DASHBOARD */}
      {user.role === 'viewer' && (
        <>
          {/* Viewer suggestions panel */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-brand-500">
              <Sparkles size={20} className="animate-bounce" />
              <h3 className="font-bold text-lg">AI Smart Recommendations</h3>
            </div>
            
            {data.recommendations.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center text-xs text-gray-400">
                Uploading creators are processing new items. Check back shortly for smart feeds.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.recommendations.map((rec) => (
                  <div key={rec._id} className="relative">
                    <MediaCard item={rec.media} currentUser={user} />
                    {/* Similarity overlay pill */}
                    <span className="absolute top-16 right-4 bg-brand-500 text-white font-bold text-[9px] px-2.5 py-0.5 rounded-full z-10 shadow uppercase tracking-wider flex items-center space-x-1">
                      <Sparkles size={10} />
                      <span>{rec.score}% Match</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Viewed & Saved Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recently Viewed Logs */}
            <div className="glass-card p-6 rounded-2xl space-y-4 lg:col-span-1">
              <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-1.5">
                <Clock size={16} className="text-gray-400" />
                <span>Recently Clicked Downloads</span>
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {data.recentViews.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No click history logged.</p>
                ) : (
                  data.recentViews.map((log) => (
                    <div key={log._id} className="p-3 bg-gray-50 dark:bg-dark-bg/60 rounded-xl flex justify-between items-center text-xs">
                      <span className="truncate max-w-[180px] font-semibold text-gray-650">{log.details.replace('Downloaded media: ', '')}</span>
                      <span className="text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Saved Content items */}
            <div className="glass-card p-6 rounded-2xl space-y-4 lg:col-span-2">
              <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-1.5">
                <CheckCircle size={16} className="text-green-500" />
                <span>Popular Public Resources</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.savedContent.map((media) => (
                  <div key={media._id} className="border border-gray-150 dark:border-gray-800 rounded-xl p-3 flex space-x-3 items-center">
                    <div className="p-2 bg-brand-500/10 rounded-lg text-brand-500">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate text-gray-700 dark:text-gray-300">{media.title}</p>
                      <p className="text-[10px] text-gray-400">By: {media.owner?.username || 'Admin'}</p>
                    </div>
                    <a href={`/api/media/${media._id}/download`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-brand-500 hover:underline">
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
