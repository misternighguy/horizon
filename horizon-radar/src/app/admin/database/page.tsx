'use client';

import { useState, useEffect } from 'react';
import { localStorageDB } from '@/data/localStorageDB';
import { DatabaseSchema } from '@/types';

export default function DatabasePage() {
  const [database, setDatabase] = useState<DatabaseSchema | null>(null);
  const [backupData, setBackupData] = useState<string>('');
  const [restoreData, setRestoreData] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadDatabaseStatus();
  }, []);

  const loadDatabaseStatus = () => {
    const db = localStorageDB.exportDatabase();
    setDatabase(db);
  };

  const handleBackup = () => {
    try {
      const backup = localStorageDB.backupDatabase();
      setBackupData(backup);
      setMessage({ type: 'success', text: 'Database backup created successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create backup: ' + error });
    }
  };

  const handleRestore = () => {
    if (!restoreData.trim()) {
      setMessage({ type: 'error', text: 'Please paste backup data to restore' });
      return;
    }

    try {
      const success = localStorageDB.restoreFromBackup(restoreData);
      if (success) {
        setMessage({ type: 'success', text: 'Database restored successfully!' });
        loadDatabaseStatus();
        setRestoreData('');
      } else {
        setMessage({ type: 'error', text: 'Failed to restore database' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to restore: ' + error });
    }
  };

  const handleClearDatabase = () => {
    if (confirm('Are you sure you want to clear the entire database? This action cannot be undone!')) {
      localStorageDB.clearDatabase();
      setMessage({ type: 'success', text: 'Database cleared successfully!' });
      loadDatabaseStatus();
    }
  };

  const handleReinitialize = () => {
    if (confirm('This will reinitialize the database with fresh mock data. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!database) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Loading Database Status...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">
            <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent">
              DATABASE STATUS
            </span>
          </h1>
          <p className="text-white/60">Horizon Radar Local Storage Database Management</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Database Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-2">Articles</h3>
            <p className="text-3xl font-light text-[rgb(var(--color-horizon-green))]">
              {database.system.stats.totalArticles}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-2">Users</h3>
            <p className="text-3xl font-light text-[rgb(var(--color-horizon-green))]">
              {database.system.stats.totalUsers}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-2">Comments</h3>
            <p className="text-3xl font-light text-[rgb(var(--color-horizon-green))]">
              {database.system.stats.totalComments}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-2">Protocols</h3>
            <p className="text-3xl font-light text-[rgb(var(--color-horizon-green))]">
              {database.system.stats.totalProtocols}
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-medium text-white mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-white/60">Version:</span>
              <span className="text-white ml-2">{database.system.version}</span>
            </div>
            <div>
              <span className="text-white/60">Last Backup:</span>
              <span className="text-white ml-2">
                {new Date(database.system.lastBackup).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Database Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Backup Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-medium text-white mb-4">Create Backup</h3>
            <p className="text-white/60 mb-4">
              Create a complete backup of the database. This can be used to restore the database later.
            </p>
            <button
              onClick={handleBackup}
              className="w-full px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black font-medium rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors"
            >
              Create Backup
            </button>
            
            {backupData && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Backup Data (Copy this to save):
                </label>
                <textarea
                  value={backupData}
                  readOnly
                  rows={8}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-mono resize-none"
                />
              </div>
            )}
          </div>

          {/* Restore Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-medium text-white mb-4">Restore Database</h3>
            <p className="text-white/60 mb-4">
              Restore the database from a backup. This will overwrite all current data.
            </p>
            <div className="space-y-4">
              <textarea
                value={restoreData}
                onChange={(e) => setRestoreData(e.target.value)}
                placeholder="Paste backup data here..."
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent resize-none"
              />
              <button
                onClick={handleRestore}
                disabled={!restoreData.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Restore Database
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
          <h3 className="text-xl font-medium text-red-400 mb-4">⚠️ Danger Zone</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleClearDatabase}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear Database
            </button>
            <button
              onClick={handleReinitialize}
              className="px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Reinitialize with Mock Data
            </button>
          </div>
          <p className="text-red-400/80 text-sm mt-4">
            These actions will permanently affect your database. Use with extreme caution.
          </p>
        </div>

        {/* Data Preview */}
        <div className="space-y-6">
          {/* Articles Preview */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-medium text-white mb-4">Recent Articles</h3>
            <div className="space-y-2">
              {database.articles.slice(0, 5).map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <span className="text-white font-medium">{article.title}</span>
                    <span className="text-white/60 ml-2">({article.ticker})</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    article.status === 'published' 
                      ? 'bg-green-500/20 text-green-400' 
                      : article.status === 'draft'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {article.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Users Preview */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-medium text-white mb-4">Recent Users</h3>
            <div className="space-y-2">
              {database.users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <span className="text-white font-medium">{user.username}</span>
                    <span className="text-white/60 ml-2">{user.email}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.memberStyle === 'admin' 
                      ? 'bg-red-500/20 text-red-400' 
                      : user.memberStyle === 'premium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.memberStyle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
