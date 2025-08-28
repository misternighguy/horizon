'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { localStorageDB } from '@/data/localStorageDB'
import { User, Comment, UserFormData, Article } from '@/types'

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

// Remove hardcoded stats - will calculate from database

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
  const [articles, setArticles] = useState<Article[]>([])
  const [researchRequests, setResearchRequests] = useState<any[]>([])
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [researchRequestFilter, setResearchRequestFilter] = useState<'all' | 'new' | 'worth_considering' | 'unworthy' | 'completed'>('all')
  const [activities, setActivities] = useState<any[]>([])

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
      // Load comments, users, and articles from database
      const dbComments = localStorageDB.getComments()
      const dbUsers = localStorageDB.getUsers()
      const dbArticles = localStorageDB.getArticles()
      
      // Load research requests from localStorage
      const storedRequests = JSON.parse(localStorage.getItem('research_requests') || '[]')
      
      setComments(dbComments)
      setUsers(dbUsers)
      setArticles(dbArticles)
      setResearchRequests(storedRequests)
      
      // Load activities
      loadActivities()
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

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Are you sure you want to permanently delete this article?')) {
      const success = localStorageDB.deleteArticle(articleId)
      if (success) {
        setArticles(prev => prev.filter(article => article.id !== articleId))
      }
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
    
    // Add activity log entry
    if (userForm.memberStyle === 'premium') {
      addActivity('new_premium_user', { username: userForm.username })
    }
    
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

  const handleUpdateResearchRequestStatus = (requestId: string, newStatus: string) => {
    const updatedRequests = researchRequests.map(request => 
      request.id === requestId ? { ...request, status: newStatus } : request
    )
    setResearchRequests(updatedRequests)
    localStorage.setItem('research_requests', JSON.stringify(updatedRequests))
  }

  // Function to add research request activity when one is submitted
  const addResearchRequestActivity = (request: any) => {
    addActivity('research_requested', {
      projectName: request.projectName,
      twitter: request.twitter,
      website: request.website
    })
  }

  const handleDeleteResearchRequest = (requestId: string) => {
    if (confirm('Are you sure you want to delete this research request? This action cannot be undone.')) {
      const updatedRequests = researchRequests.filter(request => request.id !== requestId)
      setResearchRequests(updatedRequests)
      localStorage.setItem('research_requests', JSON.stringify(updatedRequests))
    }
  }

  const handleExternalLink = (url: string, linkType: string) => {
    const confirmed = confirm(`Are you sure you want to visit this ${linkType}?\n\n${url}\n\nThis will open in a new tab.`)
    if (confirmed) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleViewFullRequest = (request: any) => {
    setSelectedRequest(request)
    setShowRequestModal(true)
  }

  const handleCloseRequestModal = () => {
    setSelectedRequest(null)
    setShowRequestModal(false)
  }

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showRequestModal) {
        handleCloseRequestModal()
      }
    }

    if (showRequestModal) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [showRequestModal])

  // Activity log functions
  const addActivity = (type: string, data: any) => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date().toISOString()
    }
    
    const updatedActivities = [newActivity, ...activities].slice(0, 100) // Keep only last 100
    setActivities(updatedActivities)
    localStorage.setItem('admin_activities', JSON.stringify(updatedActivities))
  }

  const loadActivities = () => {
    const storedActivities = localStorage.getItem('admin_activities')
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities))
    } else {
      // Generate activities from existing database data
      generateActivitiesFromDatabase()
    }
  }

  const generateActivitiesFromDatabase = () => {
    const newActivities: any[] = []
    
    // Generate activities from existing research requests
    const existingRequests = JSON.parse(localStorage.getItem('research_requests') || '[]')
    existingRequests.forEach((request: any) => {
      newActivities.push({
        id: `req_${request.id}`,
        type: 'research_requested',
        data: {
          projectName: request.projectName,
          twitter: request.twitter,
          website: request.website
        },
        timestamp: request.submittedAt || new Date().toISOString()
      })
    })

    // Generate activities from existing articles
    const existingArticles = localStorageDB.getArticles()
    existingArticles.forEach((article: any) => {
      if (article.status === 'published') {
        newActivities.push({
          id: `article_${article.id}`,
          type: 'new_article_published',
          data: {
            title: article.title,
            slug: article.slug
          },
          timestamp: article.publishedAt || article.createdAt || new Date().toISOString()
        })
      } else if (article.status === 'draft') {
        newActivities.push({
          id: `draft_${article.id}`,
          type: 'new_draft_created',
          data: {
            title: article.title,
            id: article.id
          },
          timestamp: article.createdAt || new Date().toISOString()
        })
      }
    })

    // Generate activities from existing users
    const existingUsers = localStorageDB.getUsers()
    existingUsers.forEach((user: any) => {
      if (user.memberStyle === 'premium') {
        newActivities.push({
          id: `user_${user.id}`,
          type: 'new_premium_user',
          data: {
            username: user.username
          },
          timestamp: user.createdAt || new Date().toISOString()
        })
      }
    })

    // Sort activities by timestamp (newest first)
    newActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    // Take only the most recent 100
    const recentActivities = newActivities.slice(0, 100)
    
    setActivities(recentActivities)
    localStorage.setItem('admin_activities', JSON.stringify(recentActivities))
  }

  const refreshActivities = () => {
    loadActivities()
  }

  const formatTimeAgo = (timestamp: Date | string): string => {
    const now = new Date()
    const activityTime = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    const diffInMs = now.getTime() - activityTime.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays > 0) return `${diffInDays}d ago`
    if (diffInHours > 0) return `${diffInHours}h ago`
    if (diffInMinutes > 0) return `${diffInMinutes}m ago`
    return 'Just now'
  }

  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'research_requested': return 'bg-blue-500'
      case 'new_premium_user': return 'bg-yellow-500'
      case 'new_subscriber': return 'bg-green-500'
      case 'new_article_published': return 'bg-purple-500'
      case 'new_draft_created': return 'bg-orange-500'
      case 'database_backup_created': return 'bg-indigo-500'
      default: return 'bg-gray-500'
    }
  }

  const getActivityIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'research_requested':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      case 'new_premium_user':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'new_subscriber':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      case 'new_article_published':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'new_draft_created':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'database_backup_created':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
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

  const filteredResearchRequests = researchRequests
    .filter(request => {
      const matchesFilter = researchRequestFilter === 'all' || request.status === researchRequestFilter
      
      const matchesSearch = request.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.website && request.website.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (request.twitter && request.twitter.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (request.notes && request.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (request.problemStatement && request.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()) // Sort by most recent first

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
    <div className="min-h-screen bg-black text-white flex flex-col">
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
              <Link
                href="/"
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                Return Home
              </Link>
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
              { id: 'dashboard', label: 'DASHBOARD', icon: 'dashboard' },
              { id: 'users', label: 'USERS', icon: 'users' },
              { id: 'content', label: 'CONTENT', icon: 'content' },
              { id: 'comments', label: 'COMMENTS', icon: 'comments' },
              { id: 'research-requests', label: 'RESEARCH REQUESTS', icon: 'research' },
              { id: 'database', label: 'DATABASE', icon: 'database' },
              { id: 'billing', label: 'BILLING', icon: 'billing' },
              { id: 'analytics', label: 'ANALYTICS', icon: 'analytics' },
              { id: 'settings', label: 'SETTINGS', icon: 'settings' }
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
                <span className="mr-2 text-white">
                  {tab.icon === 'dashboard' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="9" y1="9" x2="9" y2="21"/>
                      <line x1="15" y1="9" x2="15" y2="21"/>
                      <line x1="9" y1="9" x2="15" y2="9"/>
                      <line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                  ) : tab.icon === 'users' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  ) : tab.icon === 'content' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                  ) : tab.icon === 'comments' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  ) : tab.icon === 'research' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                  ) : tab.icon === 'database' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                      <ellipse cx="12" cy="5" rx="9" ry="3"/>
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                    </svg>
                  ) : tab.icon === 'billing' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  ) : tab.icon === 'analytics' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .74-.4 1.36-1 1.51z"/>
                    </svg>
                  )}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-7xl px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: users.length.toLocaleString(), icon: 'users', color: 'from-blue-500 to-blue-600' },
                { label: 'Total Articles', value: articles.length.toLocaleString(), icon: 'content', color: 'from-green-500 to-green-600' },
                { label: 'Total Comments', value: comments.length.toLocaleString(), icon: 'message', color: 'from-yellow-500 to-yellow-600' },
                { label: 'Published Articles', value: articles.filter(a => a.status === 'published').length.toLocaleString(), icon: 'check', color: 'from-purple-500 to-purple-600' }
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                      <p className="text-2xl font-light">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                      {stat.icon === 'users' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      ) : stat.icon === 'content' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10,9 9,9 8,9"/>
                        </svg>
                      ) : stat.icon === 'message' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      ) : stat.icon === 'check' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                      )}
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
                  <Link href="/admin/create/article" className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 block text-center flex items-center justify-center space-x-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    <span>Create New Article</span>
                  </Link>
                  <Link href="/admin/drafts" className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 block text-center flex items-center justify-center space-x-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    <span>View Drafts</span>
                  </Link>
                  <button 
                    onClick={() => setActiveTab('content')}
                    className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    <span>Manage Articles</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('comments')}
                    className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>Moderate Comments</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>Manage Users</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('research-requests')}
                    className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4"/>
                      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3z"/>
                      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3z"/>
                      <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3z"/>
                      <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3z"/>
                    </svg>
                    <span>View Research Requests</span>
                  </button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Activity Log</h3>
                  <button
                    onClick={refreshActivities}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors text-sm flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </button>
                </div>
                <div className="space-y-3 text-sm max-h-64 overflow-y-auto">
                  {activities.length === 0 ? (
                    <div className="text-center py-8 text-white/40">
                      No activity yet
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full`}></div>
                        <div className="flex items-center space-x-2 text-white/80">
                          {getActivityIcon(activity.type)}
                          <span>
                            {activity.type === 'research_requested' && (
                              <>
                                Research Requested{' '}
                                {activity.data.twitter && (
                                  activity.data.twitter.includes('twitter.com') || activity.data.twitter.includes('x.com') ? (
                                    <button
                                      onClick={() => {
                                        const url = activity.data.twitter.startsWith('http') ? activity.data.twitter : `https://${activity.data.twitter}`
                                        window.open(url, '_blank', 'noopener,noreferrer')
                                      }}
                                      className="text-[rgb(var(--color-horizon-green))] hover:underline"
                                    >
                                      {activity.data.projectName}
                                    </button>
                                  ) : (
                                    <span className="text-white/60">{activity.data.projectName}</span>
                                  )
                                )}
                              </>
                            )}
                            {activity.type === 'new_premium_user' && (
                              <>New Premium User <span className="text-[rgb(var(--color-horizon-green))]">{activity.data.username}</span></>
                            )}
                            {activity.type === 'new_subscriber' && (
                              <>New Subscriber <span className="text-[rgb(var(--color-horizon-green))]">{activity.data.email}</span></>
                            )}
                            {activity.type === 'new_article_published' && (
                              <>
                                New Article Published{' '}
                                <button
                                  onClick={() => window.open(`/article/${activity.data.slug}`, '_blank')}
                                  className="text-[rgb(var(--color-horizon-green))] hover:underline"
                                >
                                  {activity.data.title}
                                </button>
                              </>
                            )}
                            {activity.type === 'new_draft_created' && (
                              <>
                                New Draft Created{' '}
                                <button
                                  onClick={() => window.open(`/admin/create/article?edit=${activity.data.id}`, '_blank')}
                                  className="text-[rgb(var(--color-horizon-green))] hover:underline"
                                >
                                  {activity.data.title}
                                </button>
                              </>
                            )}
                            {activity.type === 'database_backup_created' && (
                              <>Database Backup Created</>
                            )}
                          </span>
                        </div>
                        <span className="text-white/40 ml-auto">{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    ))
                  )}
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
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light">Content Management</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-white/60">
                    Total Articles: {articles.length} | Published: {articles.filter(a => a.status === 'published').length} | Drafts: {articles.filter(a => a.status === 'draft').length}
                  </span>
                </div>
              </div>
              
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
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={article.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                  {/* Article Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-2">{article.title}</h3>
                      <p className="text-sm text-white/60 mb-2">{article.subtitle}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          article.status === 'published' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {article.status}
                        </span>
                        <span className="text-xs text-white/40">{article.ticker}</span>
                      </div>
                    </div>
                  </div>

                  {/* Article Meta */}
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-white/70">
                      <span className="text-white/40">Author:</span> {article.author}
                    </div>
                    <div className="text-sm text-white/70">
                      <span className="text-white/40">Published:</span> {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Not published'}
                    </div>
                    <div className="text-sm text-white/70">
                      <span className="text-white/40">Reading Levels:</span> {article.readingLevels.join(', ')}
                    </div>
                  </div>

                  {/* Article Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-white/80 line-clamp-3">
                      {article.abstract?.[0] || 'No abstract available'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <Link 
                      href={`/article/${article.slug}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      View
                    </Link>
                    <Link 
                      href={`/admin/create/article?edit=${article.id}`}
                      className="px-4 py-2 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg text-sm font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteArticle(article.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {articles.length === 0 && (
              <div className="text-center py-12 text-white/60">
                No articles found. Create your first article above.
              </div>
            )}
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
                    Total: {researchRequests.length} | New: {researchRequests.filter(r => r.status === 'new').length} | Worth Considering: {researchRequests.filter(r => r.status === 'worth_considering').length} | Unworthy: {researchRequests.filter(r => r.status === 'unworthy').length} | Completed: {researchRequests.filter(r => r.status === 'completed').length}
                  </span>
                </div>
              </div>
              
              {/* Filters and Search */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex space-x-2">
                  {[
                    { value: 'all', label: 'All Requests' },
                    { value: 'new', label: 'New (Unseen)' },
                    { value: 'worth_considering', label: 'Worth Considering' },
                    { value: 'unworthy', label: 'Unworthy' },
                    { value: 'completed', label: 'Completed' }
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setResearchRequestFilter(filter.value as 'all' | 'new' | 'worth_considering' | 'unworthy' | 'completed')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        researchRequestFilter === filter.value
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
              {filteredResearchRequests.length === 0 ? (
                <div className="text-center py-12 text-white/60">
                  No research requests found matching your criteria.
                </div>
              ) : (
                filteredResearchRequests.map((request) => (
                  <div key={request.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-medium text-white">{request.projectName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            request.status === 'new' 
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                              : request.status === 'worth_considering'
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              : request.status === 'unworthy'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-green-500/20 text-green-400 border-green-500/30'
                          }`}>
                            {request.status === 'new' ? 'New (Unseen)' : 
                             request.status === 'worth_considering' ? 'Worth Considering' : 
                             request.status === 'unworthy' ? 'Unworthy' : 'Completed'}
                          </span>
                          <span className="text-xs text-white/40">
                            {request.type === 'informal' ? 'Informal' : 'Formal'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {request.website && (
                            <div>
                              <span className="text-white/60 text-sm">Website:</span>
                              <button 
                                onClick={() => handleExternalLink(request.website, 'website')}
                                className="block text-white/80 hover:text-white transition-colors text-left"
                              >
                                {request.website}
                              </button>
                            </div>
                          )}
                          {request.twitter && (
                            <div>
                              <span className="text-white/60 text-sm">Twitter:</span>
                              <button 
                                onClick={() => handleExternalLink(`https://twitter.com/${request.twitter.replace('@', '')}`, 'Twitter profile')}
                                className="block text-white/80 hover:text-white transition-colors text-left"
                              >
                                {request.twitter}
                              </button>
                            </div>
                          )}
                          {request.contractAddress && (
                            <div>
                              <span className="text-white/60 text-sm">Contract:</span>
                              <span className="text-white/80">{request.contractAddress}</span>
                            </div>
                          )}
                          {request.chain && (
                            <div>
                              <span className="text-white/60 text-sm">Chain:</span>
                              <span className="text-white/80">{request.chain}</span>
                            </div>
                          )}
                        </div>

                        {request.problemStatement && (
                          <div className="mb-4">
                            <span className="text-white/60 text-sm">Problem Statement:</span>
                            <p className="text-white/80 text-sm mt-1">{request.problemStatement}</p>
                          </div>
                        )}

                        {request.notes && (
                          <div className="mb-4">
                            <span className="text-white/60 text-sm">Notes:</span>
                            <p className="text-white/80 text-sm mt-1">{request.notes}</p>
                          </div>
                        )}

                        <div className="text-sm text-white/60">
                          Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-6">
                        <button
                          onClick={() => handleViewFullRequest(request)}
                          className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-colors text-sm"
                          title="View Full Request"
                        >
                          View Full Request
                        </button>
                        
                        <select
                          value={request.status}
                          onChange={(e) => handleUpdateResearchRequestStatus(request.id, e.target.value)}
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))]"
                        >
                          <option value="new">New (Unseen)</option>
                          <option value="worth_considering">Worth Considering</option>
                          <option value="unworthy">Unworthy</option>
                          <option value="completed">Completed</option>
                        </select>
                        
                        <button
                          onClick={() => handleDeleteResearchRequest(request.id)}
                          className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                          title="Delete Request"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
                    
                    // Add activity log entry
                    addActivity('database_backup_created', {})
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
                >
                  Download Backup
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

      {/* Research Request Full View Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Full Research Request Details</h3>
              <button
                onClick={handleCloseRequestModal}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-white">{selectedRequest.projectName}</h4>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      selectedRequest.status === 'new' 
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                        : selectedRequest.status === 'worth_considering'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : selectedRequest.status === 'unworthy'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                    }`}>
                      {selectedRequest.status === 'new' ? 'New (Unseen)' : 
                       selectedRequest.status === 'worth_considering' ? 'Worth Considering' : 
                       selectedRequest.status === 'unworthy' ? 'Unworthy' : 'Completed'}
                    </span>
                    <span className="text-xs text-white/40">
                      {selectedRequest.type === 'informal' ? 'Informal Request' : 'Formal Request'}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-white/60">
                  Submitted: {new Date(selectedRequest.submittedAt).toLocaleString('en-US', {
                    timeZone: 'America/New_York',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })} EST
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedRequest.website && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Official Website</label>
                    <button 
                      onClick={() => handleExternalLink(selectedRequest.website, 'website')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white transition-colors text-left"
                    >
                      {selectedRequest.website}
                    </button>
                  </div>
                )}
                
                {selectedRequest.twitter && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Official Twitter</label>
                    <button 
                      onClick={() => handleExternalLink(`https://twitter.com/${selectedRequest.twitter.replace('@', '')}`, 'Twitter profile')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white transition-colors text-left"
                    >
                      {selectedRequest.twitter}
                    </button>
                  </div>
                )}
              </div>

              {/* Formal Request Specific Fields */}
              {selectedRequest.type === 'formal' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedRequest.contractAddress && (
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Contract Address</label>
                        <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                          {selectedRequest.contractAddress}
                        </div>
                      </div>
                    )}
                    
                    {selectedRequest.chain && (
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Chain</label>
                        <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                          {selectedRequest.chain}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedRequest.category && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                      <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                        {selectedRequest.category}
                      </div>
                    </div>
                  )}

                  {selectedRequest.problemStatement && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Problem Statement</label>
                      <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                        {selectedRequest.problemStatement}
                      </div>
                    </div>
                  )}

                  {selectedRequest.keyRisks && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Key Risks</label>
                      <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                        {selectedRequest.keyRisks}
                      </div>
                    </div>
                  )}

                  {selectedRequest.docsLinks && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Documentation Links</label>
                      <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                        {selectedRequest.docsLinks}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Informal Request Specific Fields */}
              {selectedRequest.type === 'informal' && (
                <>
                  {selectedRequest.docsLink && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Documentation Link</label>
                      <button 
                        onClick={() => handleExternalLink(selectedRequest.docsLink, 'documentation')}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white transition-colors text-left"
                      >
                        {selectedRequest.docsLink}
                      </button>
                    </div>
                  )}

                  {selectedRequest.helpfulLink1 && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Helpful Link #1</label>
                      <button 
                        onClick={() => handleExternalLink(selectedRequest.helpfulLink1, 'helpful resource')}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white transition-colors text-left"
                      >
                        {selectedRequest.helpfulLink1}
                      </button>
                    </div>
                  )}

                  {selectedRequest.helpfulLink2 && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Helpful Link #2</label>
                      <button 
                        onClick={() => handleExternalLink(selectedRequest.helpfulLink2, 'helpful resource')}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white transition-colors text-left"
                      >
                        {selectedRequest.helpfulLink2}
                      </button>
                    </div>
                  )}

                  {selectedRequest.notes && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Additional Notes</label>
                      <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                        {selectedRequest.notes}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleCloseRequestModal}
                  className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
