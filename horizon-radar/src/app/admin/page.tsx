'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { localStorageDB } from '@/data/localStorageDB'
import { User, Comment, UserFormData } from '@/types'

interface AdminUser {
  username: string
  role: string
  lastLogin: string
  permissions: string[]
}

interface AdminStats {
  totalUsers: number
  totalProtocols: number
  totalRevenue: number
  activeSubscriptions: number
}

const adminStats: AdminStats = {
  totalUsers: 1247,
  totalProtocols: 89,
  totalRevenue: 45620,
  activeSubscriptions: 892
}

const adminUser: AdminUser = {
  username: 'thenighguy',
  role: 'Superadmin',
  lastLogin: '2025-01-24 14:32',
  permissions: ['Full Access', 'User Management', 'Content Management', 'Analytics', 'Billing', 'Settings']
}

// Mock data removed - now using localStorageDB

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showLoginError, setShowLoginError] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [commentFilter, setCommentFilter] = useState<'all' | 'flagged' | 'hidden'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [userForm, setUserForm] = useState<UserFormData>({
    username: '',
    password: '',
    email: '',
    memberStyle: 'free',
    duration: 1
  })
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    // Check if already logged in
    const adminSession = localStorage.getItem('adminSession')
    if (adminSession === 'thenighguy') {
      setIsLoggedIn(true)
    }
  }, [])

  // Load data from database when logged in
  useEffect(() => {
    if (isLoggedIn) {
      // Load comments and users from database
      const dbComments = localStorageDB.getComments()
      const dbUsers = localStorageDB.getUsers()
      setComments(dbComments)
      setUsers(dbUsers)
    }
  }, [isLoggedIn])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'thenighguy' && password === 'JesusChrist') {
      setIsLoggedIn(true)
      localStorage.setItem('adminSession', username)
      setShowLoginError(false)
    } else {
      setShowLoginError(true)
      setTimeout(() => setShowLoginError(false), 3000)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('adminSession')
    setUsername('')
    setPassword('')
  }

  const formatTimeAgo = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInMs = now.getTime() - dateObj.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  const handleHideComment = (commentId: string) => {
    const updatedComment = localStorageDB.updateComment(commentId, { isHidden: !comments.find(c => c.id === commentId)?.isHidden })
    if (updatedComment) {
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, isHidden: !comment.isHidden }
          : comment
      ))
    }
  }

  const handleFlagComment = (commentId: string) => {
    const updatedComment = localStorageDB.updateComment(commentId, { isFlagged: !comments.find(c => c.id === commentId)?.isFlagged })
    if (updatedComment) {
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, isFlagged: !comment.isFlagged }
          : comment
      ))
    }
  }

  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment)
    setShowCommentModal(true)
  }

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Are you sure you want to permanently delete this comment?')) {
      const success = localStorageDB.deleteComment(commentId)
      if (success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId))
      }
    }
  }

  const handleSaveComment = (commentId: string, newContent: string) => {
    const updatedComment = localStorageDB.updateComment(commentId, { content: newContent })
    if (updatedComment) {
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: newContent }
          : comment
      ))
      setShowCommentModal(false)
      setSelectedComment(null)
    }
  }

  const handleCreateUser = () => {
    // Create new user via database
    const newUser = localStorageDB.createUser({
      username: userForm.username,
      email: userForm.email,
      memberStyle: userForm.memberStyle,
      duration: userForm.duration,
      isActive: true
    })
    
    // Add user to state
    setUsers(prev => [newUser, ...prev])
    
    // Reset form and close modal
    setUserForm({
      username: '',
      password: '',
      email: '',
      memberStyle: 'free',
      duration: 1
    })
    setShowCreateUserModal(false)
    
    // Show success message
    alert(`User ${userForm.username} created successfully with ${userForm.memberStyle} access for ${userForm.duration} month(s)`)
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleToggleUserStatus = (userId: string) => {
    const updatedUser = localStorageDB.updateUser(userId, { isActive: !users.find(u => u.id === userId)?.isActive })
    if (updatedUser) {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isActive: !user.isActive }
          : user
      ))
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const success = localStorageDB.deleteUser(userId)
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== userId))
      }
    }
  }

  const filteredComments = comments.filter(comment => {
    const matchesFilter = commentFilter === 'all' || 
      (commentFilter === 'flagged' && comment.isFlagged) ||
      (commentFilter === 'hidden' && comment.isHidden)
    
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.articleTitle.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-4xl font-light mb-2">
              <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent">
                ADMIN PANEL
              </span>
            </h1>
            <p className="text-white/70">Access Horizon Radar administration</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent transition-all duration-300"
                  placeholder="Enter username"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent transition-all duration-300"
                  placeholder="Enter password"
                  required
                />
              </div>

              {showLoginError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  Invalid username or password
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 px-6 bg-[rgb(var(--color-horizon-green))] text-black rounded-full font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300 transform hover:scale-105"
              >
                LOGIN TO ADMIN
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-light">
                <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent">
                  HORIZON RADAR ADMIN
                </span>
              </h1>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-white/60">Logged in as:</span>
                <span className="text-[rgb(var(--color-horizon-green))] font-medium">{adminUser.username}</span>
                <span className="text-white/40">({adminUser.role})</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/60">{adminUser.lastLogin}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/3 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'DASHBOARD', icon: '📊' },
              { id: 'users', label: 'USERS', icon: '👥' },
              { id: 'content', label: 'CONTENT', icon: '📝' },
              { id: 'comments', label: 'COMMENTS', icon: '💬' },
              { id: 'research-requests', label: 'RESEARCH REQUESTS', icon: '🔬' },
              { id: 'database', label: 'DATABASE', icon: '🗄️' },
              { id: 'billing', label: 'BILLING', icon: '💳' },
              { id: 'analytics', label: 'ANALYTICS', icon: '📈' },
              { id: 'settings', label: 'SETTINGS', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-[rgb(var(--color-horizon-green))] border-[rgb(var(--color-horizon-green))]'
                    : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), icon: '👥', color: 'from-blue-500 to-blue-600' },
                { label: 'Total Protocols', value: adminStats.totalProtocols.toLocaleString(), icon: '📝', color: 'from-green-500 to-green-600' },
                { label: 'Total Revenue', value: `$${adminStats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'from-yellow-500 to-yellow-600' },
                { label: 'Active Subscriptions', value: adminStats.activeSubscriptions.toLocaleString(), icon: '🔗', color: 'from-purple-500 to-purple-600' }
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                      <p className="text-2xl font-light">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/admin/create/article" className="w-full py-3 px-4 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300 block text-center">
                    Create New Article
                  </Link>
                  <Link href="/admin/drafts" className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 block text-center">
                    View Drafts
                  </Link>
                  <button 
                    onClick={() => setActiveTab('comments')}
                    className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all duration-300"
                  >
                    Moderate Comments
                  </button>
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300"
                  >
                    Manage Users
                  </button>
                  <button 
                    onClick={() => setActiveTab('research-requests')}
                    className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all duration-300"
                  >
                    View Research Requests
                  </button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[rgb(var(--color-horizon-green))] rounded-full"></div>
                    <span className="text-white/80">New user registration</span>
                    <span className="text-white/40 ml-auto">2m ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-white/80">Protocol published</span>
                    <span className="text-white/40 ml-auto">15m ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-white/80">Payment received</span>
                    <span className="text-white/40 ml-auto">1h ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">System Status</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">API Health</span>
                    <span className="text-[rgb(var(--color-horizon-green))]">● Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Database</span>
                    <span className="text-[rgb(var(--color-horizon-green))]">● Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">CDN</span>
                    <span className="text-[rgb(var(--color-horizon-green))]">● Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-2xl font-light mb-6">User Management</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                />
                <button 
                  onClick={() => setShowCreateUserModal(true)}
                  className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300"
                >
                  Create User
                </button>
              </div>
              {/* Users Table */}
              <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Member Style</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Expires</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{user.username}</div>
                              <div className="text-sm text-white/60">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.memberStyle === 'admin' 
                                ? 'bg-red-500/20 text-red-400' 
                                : user.memberStyle === 'premium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {user.memberStyle.charAt(0).toUpperCase() + user.memberStyle.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            {user.duration} month{user.duration > 1 ? 's' : ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            {formatDate(user.expiresAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.isActive 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                className={`px-2 py-1 rounded text-xs transition-colors ${
                                  user.isActive
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                }`}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {users.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    No users found. Create your first user above.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-2xl font-light mb-6">Content Management</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Link href="/admin/create/article" className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300">
                  Create New Article
                </Link>
                <Link href="/admin/drafts" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300">
                  View Drafts
                </Link>
                <Link href="/admin/test" className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all duration-300">
                  Test Articles
                </Link>
                <button 
                  onClick={() => setActiveTab('comments')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all duration-300"
                >
                  Moderate Comments
                </button>
                <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300">
                  Manage Articles
                </button>
              </div>
              <div className="text-center py-12 text-white/60">
                Article management interface coming soon...
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light">Comment Moderation</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-white/60">
                    Total: {comments.length} | Hidden: {comments.filter(c => c.isHidden).length} | Flagged: {comments.filter(c => c.isFlagged).length}
                  </span>
                </div>
              </div>
              
              {/* Filters and Search */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex space-x-2">
                  {[
                    { value: 'all', label: 'All Comments' },
                    { value: 'flagged', label: 'Flagged' },
                    { value: 'hidden', label: 'Hidden' }
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setCommentFilter(filter.value as 'all' | 'flagged' | 'hidden')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        commentFilter === filter.value
                          ? 'bg-[rgb(var(--color-horizon-green))] text-black'
                          : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search comments, authors, or articles..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                />
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {filteredComments.map((comment) => (
                <div key={comment.id} className={`bg-white/5 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 ${
                  comment.isHidden 
                    ? 'border-red-500/30 bg-red-500/5' 
                    : comment.isFlagged 
                    ? 'border-yellow-500/30 bg-yellow-500/5'
                    : 'border-white/20'
                }`}>
                  {/* Comment Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: comment.authorColor }}
                      >
                        <span className="text-black text-sm font-medium">{comment.authorInitials}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">{comment.author}</span>
                          {comment.isHidden && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Hidden</span>
                          )}
                          {comment.isFlagged && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Flagged</span>
                          )}
                        </div>
                        <div className="text-sm text-white/60">
                          {formatTimeAgo(comment.timestamp)} • {comment.articleTitle}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditComment(comment)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleFlagComment(comment.id)}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          comment.isFlagged
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                        }`}
                      >
                        {comment.isFlagged ? 'Unflag' : 'Flag'}
                      </button>
                      <button
                        onClick={() => handleHideComment(comment.id)}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          comment.isHidden
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {comment.isHidden ? 'Unhide' : 'Hide'}
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Comment Content */}
                  <div className="mb-4">
                    <p className="text-white/90 leading-relaxed">{comment.content}</p>
                  </div>
                  
                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-8 space-y-3">
                      <h4 className="text-sm font-medium text-white/70 mb-2">Replies:</h4>
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: reply.authorColor }}
                              >
                                <span className="text-black text-xs font-medium">{reply.authorInitials}</span>
                              </div>
                              <span className="font-medium text-white text-sm">{reply.author}</span>
                              <span className="text-xs text-white/60">{formatTimeAgo(reply.timestamp)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditComment(reply)}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(reply.id)}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {filteredComments.length === 0 && (
                <div className="text-center py-12 text-white/60">
                  No comments found matching your criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'research-requests' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light">Research Requests</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-white/60">
                    Total: {localStorageDB.getNewsletterSubscriptions().length} | New: {localStorageDB.getNewsletterSubscriptions().filter(s => s.status === 'subscribed').length}
                  </span>
                </div>
              </div>
              
              {/* Filters and Search */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex space-x-2">
                  {[
                    { value: 'all', label: 'All Requests' },
                    { value: 'new', label: 'New' },
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'closed', label: 'Closed' }
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setCommentFilter(filter.value as 'all' | 'flagged' | 'hidden')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        commentFilter === filter.value
                          ? 'bg-[rgb(var(--color-horizon-green))] text-black'
                          : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search research requests..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                />
              </div>
            </div>

            {/* Research Requests List */}
            <div className="space-y-4">
              <div className="text-center py-12 text-white/60">
                Research requests interface coming soon...
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-2xl font-light mb-6">Billing & Subscriptions</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300">
                  View Stripe Dashboard
                </button>
                <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300">
                  Manage Plans
                </button>
                <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300">
                  Refunds
                </button>
              </div>
              <div className="text-center py-12 text-white/60">
                Billing interface coming soon...
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-2xl font-light mb-6">Analytics & Insights</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300">
                  Export Data
                </button>
                <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300">
                  View Reports
                </button>
                <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300">
                  Performance Metrics
                </button>
              </div>
              <div className="text-center py-12 text-white/60">
                Analytics dashboard coming soon...
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-2xl font-light mb-6">Database Management</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/admin/database"
                  className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300"
                >
                  Open Database Console
                </Link>
                <button 
                  onClick={() => {
                    const backup = localStorageDB.backupDatabase()
                    const blob = new Blob([backup], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `horizon-radar-backup-${new Date().toISOString().split('T')[0]}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
                >
                  Download Backup
                </button>
                <button 
                  onClick={() => {
                    if (confirm('This will reinitialize the database with fresh mock data. Continue?')) {
                      localStorage.clear()
                      window.location.reload()
                    }
                  }}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all duration-300"
                >
                  Reset Database
                </button>
              </div>
              <div className="text-center py-8 text-white/60">
                Manage your local storage database, create backups, and perform maintenance operations.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-2xl font-light mb-6">System Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300">
                  Feature Flags
                </button>
                <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300">
                  API Keys
                </button>
                <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300">
                  Environment
                </button>
              </div>
              <div className="text-center py-12 text-white/60">
                Settings interface coming soon...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comment Edit Modal */}
      {showCommentModal && selectedComment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Edit Comment</h3>
              <button
                onClick={() => setShowCommentModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Author
                </label>
                <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                  {selectedComment.author}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Article
                </label>
                <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                  {selectedComment.articleTitle}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Comment Content
                </label>
                <textarea
                  defaultValue={selectedComment.content}
                  id="editCommentContent"
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent resize-none"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const newContent = (document.getElementById('editCommentContent') as HTMLTextAreaElement).value
                    if (newContent.trim()) {
                      handleSaveComment(selectedComment.id, newContent.trim())
                    }
                  }}
                  className="px-6 py-2 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Create New User</h3>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Member Style
                </label>
                <select
                  value={userForm.memberStyle}
                  onChange={(e) => setUserForm(prev => ({ ...prev, memberStyle: e.target.value as 'free' | 'premium' | 'admin' }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Account Duration
                </label>
                <select
                  value={userForm.duration}
                  onChange={(e) => setUserForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {month} month{month > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={!userForm.username || !userForm.password || !userForm.email}
                  className="px-6 py-2 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
