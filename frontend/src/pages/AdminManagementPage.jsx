import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, History, Trash2, Shield, UserCheck, AlertCircle, FileSpreadsheet } from 'lucide-react';

export const AdminManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'logs'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      if (activeTab === 'users') {
        const res = await axios.get('/api/users');
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } else {
        const res = await axios.get('/api/analytics/logs');
        if (res.data.success) {
          setLogs(res.data.logs);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axios.put(`/api/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        alert('User role updated successfully');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? All their uploaded media will also be permanently deleted.')) {
      try {
        const res = await axios.delete(`/api/users/${userId}`);
        if (res.data.success) {
          alert('User deleted successfully');
          fetchData();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  // Simulated Report Download for Viva demonstrations
  const handleDownloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ users, logs }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AuraMedia_Platform_AuditReport_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
            <Shield size={24} className="text-brand-500" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
            Manage user directories, audit access logs, and generate compliance reports
          </p>
        </div>

        {/* Generate report trigger */}
        <button
          onClick={handleDownloadReport}
          className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 w-fit"
        >
          <FileSpreadsheet size={14} />
          <span>Export System Audit Report</span>
        </button>
      </div>

      {/* Tabs Selection Bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'users'
              ? 'border-brand-500 text-brand-500'
              : 'border-transparent text-gray-400 hover:text-gray-500'
          }`}
        >
          <Users size={16} />
          <span>User Directory</span>
        </button>
        
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'logs'
              ? 'border-brand-500 text-brand-500'
              : 'border-transparent text-gray-400 hover:text-gray-500'
          }`}
        >
          <History size={16} />
          <span>Audit Logs Tracker</span>
        </button>
      </div>

      {/* Error Panel */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl p-3 flex items-center space-x-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Content display */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </div>
      ) : activeTab === 'users' ? (
        // Users Table grid
        <div className="glass-card rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-100 dark:bg-gray-800 text-[10px] uppercase font-bold text-gray-400">
                <tr>
                  <th className="p-4">Profile</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Role Privileges</th>
                  <th className="p-4">Registration Date</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-850/30">
                    <td className="p-4 flex items-center space-x-3">
                      <img src={item.profileImage} alt={item.username} className="w-8 h-8 rounded-full border" />
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{item.username}</span>
                    </td>
                    <td className="p-4 font-mono">{item.email}</td>
                    <td className="p-4">
                      {/* Role selection toggle */}
                      <select
                        value={item.role}
                        onChange={(e) => handleRoleChange(item._id, e.target.value)}
                        className="glass-input text-[11px] font-bold py-1 px-2 border dark:bg-dark-card"
                      >
                        <option value="admin">Admin</option>
                        <option value="creator">Creator</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>
                    <td className="p-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteUser(item._id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete User account"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // System logs table
        <div className="glass-card rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-xl animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-100 dark:bg-gray-800 text-[10px] uppercase font-bold text-gray-400">
                <tr>
                  <th className="p-4">User Account</th>
                  <th className="p-4">Action Type</th>
                  <th className="p-4">Auditing Description</th>
                  <th className="p-4">Device Agent</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-850/30">
                    <td className="p-4 flex flex-col">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {log.user ? log.user.username : 'Anonymous'}
                      </span>
                      <span className="text-[10px] text-gray-400">{log.user ? log.user.email : 'N/A'}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[10px] uppercase text-brand-500">
                      {log.action}
                    </td>
                    <td className="p-4">{log.details}</td>
                    <td className="p-4 text-[10px] truncate max-w-xs" title={log.userAgent}>
                      {log.userAgent || 'IP: ' + log.ipAddress}
                    </td>
                    <td className="p-4 text-gray-400">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagementPage;
