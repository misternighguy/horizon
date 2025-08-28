'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfilePicture from '@/components/ProfilePicture';
import ProfileUploadModal from '@/components/ProfileUploadModal';
import { useProfilePicture } from '@/hooks/useProfilePicture';

interface User {
  id: string;
  username: string;
  email: string;
  memberStyle: 'free' | 'premium' | 'admin';
  duration: number;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  lastLogin?: Date;
  profile?: {
    avatar?: string;
    bio?: string;
    twitter?: string;
    linkedin?: string;
  };
  preferences?: {
    readingLevel?: 'novice' | 'technical' | 'analyst';
    notifications: boolean;
    newsletter: boolean;
  };
  watchlist?: string[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    twitter: '',
    linkedin: '',
    notifications: true,
    newsletter: true,
    readingLevel: 'novice' as 'novice' | 'technical' | 'analyst'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Profile picture upload hook
  const {
    isUploading,
    showUploadModal,
    handleUpload,
    openUploadModal,
    closeUploadModal
  } = useProfilePicture({
    onUploadSuccess: (imageDataUrl) => {
      if (!user) return;
      
      // Update user profile with new avatar
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          avatar: imageDataUrl
        }
      };
      
      // Save to localStorage
      const localStorageDB = window.localStorageDB;
      if (localStorageDB) {
        localStorageDB.updateUser(user.id, { profile: updatedUser.profile });
        setUser(updatedUser);
      }
    }
  });

  useEffect(() => {
    const loadUserData = () => {
      try {
        const localStorageDB = window.localStorageDB;
        const username = localStorage.getItem('userSession') || localStorage.getItem('adminSession');
        
        if (localStorageDB && username) {
          const userData = localStorageDB.getUserByUsername(username);
          if (userData) {
            setUser(userData);
            setFormData({
              username: userData.username || '',
              email: userData.email || '',
              bio: userData.profile?.bio || '',
              twitter: userData.profile?.twitter || '',
              linkedin: userData.profile?.linkedin || '',
              notifications: userData.preferences?.notifications ?? true,
              newsletter: userData.preferences?.newsletter ?? true,
              readingLevel: userData.preferences?.readingLevel || 'novice'
            });
          } else {
            // User session exists but user not found in database
            setShowLoginPopup(true);
          }
        } else {
          // No session found
          setShowLoginPopup(true);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setShowLoginPopup(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
    }, []);

  // Mouse tracking tilt effect for gold card
  useEffect(() => {
    const card = document.getElementById('goldCard');
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Calculate rotation based on mouse position (subtle effect)
      const rotateX = (mouseY / (rect.height / 2)) * -2; // Max 2 degrees
      const rotateY = (mouseX / (rect.width / 2)) * 2; // Max 2 degrees
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSave = () => {
    try {
      const localStorageDB = window.localStorageDB;
      if (localStorageDB && user) {
        const updatedUser = {
          ...user,
          username: formData.username,
          email: formData.email,
          profile: {
            ...user.profile,
            bio: formData.bio,
            twitter: formData.twitter,
            linkedin: formData.linkedin
          },
          preferences: {
            ...user.preferences,
            readingLevel: user.preferences?.readingLevel || 'novice',
            notifications: formData.notifications,
            newsletter: formData.newsletter
          }
        };
        
        localStorageDB.updateUser(user.id, {
          username: formData.username,
          email: formData.email,
          profile: {
            ...user.profile,
            bio: formData.bio,
            twitter: formData.twitter,
            linkedin: formData.linkedin
          },
          preferences: {
            readingLevel: formData.readingLevel,
            notifications: formData.notifications,
            newsletter: formData.newsletter
          }
        });
        setUser(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const getProfileTitle = (memberStyle: string) => {
    switch (memberStyle) {
      case 'free': return 'Free Profile';
      case 'premium': return 'Premium Profile';
      case 'admin': return 'Admin Profile';
      default: return 'Profile';
    }
  };

  const getAccountType = (memberStyle: string) => {
    switch (memberStyle) {
      case 'free': return 'Free Account';
      case 'premium': return 'Premium User';
      case 'admin': return 'Admin';
      default: return 'Account';
    }
  };

  const getMemberStyleDisplay = (style: string) => {
    switch (style) {
      case 'free': return 'Free';
      case 'premium': return 'Premium';
      case 'admin': return 'Admin';
      default: return style;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 z-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (showLoginPopup || !user) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 z-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <h1 className="text-3xl font-medium mb-4">Create an Account</h1>
            <p className="mb-8 text-white/90">Create an account to view your profile.</p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-[rgb(var(--color-horizon-green))] text-black font-medium rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors"
            >
              <Icons.Login className="w-5 h-5" />
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image - Same as landing page */}
      <div className="absolute inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat" />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 z-0 bg-black/20" />
      
      {/* Header positioned on top of background */}
      <div className="relative z-20">
        <Header />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full py-6 sm:py-8 md:py-10 space-y-6 sm:space-y-8 sm:mt-[1.5vh]">
        {/* Hero Section */}
        <section className="space-y-4 text-center px-4 sm:px-6 md:px-8">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium drop-shadow-lg leading-tight">
            <span className="bg-gradient-to-r from-white via-[#E4E4E4] via-[rgb(var(--color-brand-400))] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient">
              {getProfileTitle(user.memberStyle)}
            </span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-white/90 drop-shadow-md px-4 sm:px-0">
            Manage your {getAccountType(user.memberStyle).toLowerCase()} and unlock premium features
          </p>
        </section>

        {/* Profile Content */}
        <div className="max-w-[calc(80rem-150px)] mx-auto px-4 sm:px-6 md:px-8 space-y-8">
          {/* Top Row - Combined Profile and Stats Card */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Gold Credit Card */}
            <div className="lg:col-span-4 relative overflow-hidden rounded-2xl group transition-all duration-300 preserve-3d" id="goldCard">
              {/* 3D Background - Gold for premium/admin, Silver for free */}
              <div className={`absolute inset-0 rounded-2xl shadow-2xl ${
                user.memberStyle === 'free' 
                  ? 'bg-gradient-radial from-gray-300 via-gray-400 to-gray-600' 
                  : 'bg-gradient-radial from-yellow-400 via-amber-600 to-gray-900'
              }`} />
              
              {/* 3D Depth Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40 rounded-2xl" />
              
              {/* Metallic Texture Pattern */}
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'var(--metallic-texture)' }} />
              
              {/* Metallic Shimmer Lines */}
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'var(--metallic-shimmer)' }} />
              
              {/* Sci-fi glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              {/* Main Card Content */}
              <div className={`relative backdrop-blur-sm rounded-2xl p-6 h-full shadow-xl ${
                user.memberStyle === 'free'
                  ? 'bg-gradient-to-br from-gray-300/90 via-gray-400/90 to-gray-500/90 border border-gray-300/50'
                  : 'bg-gradient-to-br from-yellow-400/90 via-yellow-500/90 to-amber-600/90 border border-yellow-300/50'
              }`}>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  {/* Logo/Brand */}
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Horizon Radar Logo" className="w-12 h-12 object-contain" />
                    <div>
                      <h3 className="text-black/80 text-sm font-medium tracking-wider uppercase">HORIZON RADAR</h3>
                    </div>
                  </div>
                  
                  {/* Member Status Badge */}
                  <div className={`px-4 py-2 rounded-full text-sm font-bold tracking-wider uppercase ${
                    user.memberStyle === 'premium' 
                      ? 'bg-black/20 text-black border border-black/30 shadow-lg' 
                      : user.memberStyle === 'admin'
                      ? 'bg-purple-600/80 text-white shadow-lg'
                      : 'bg-black/20 text-black border border-black/30'
                  }`}>
                    {getMemberStyleDisplay(user.memberStyle)}
                  </div>
                </div>

                {/* Member Info Section */}
                <div className="mb-6">
                  {/* Avatar and Name Row */}
                  <div className="flex items-center gap-4 mb-3">
                    <ProfilePicture
                      src={user.profile?.avatar}
                      alt={`${user.username}'s profile picture`}
                      username={user.username}
                      size="md"
                      onClick={openUploadModal}
                      showUploadOverlay={true}
                      showVerification={false}
                    />
                    <div>
                      <h2 className="text-xl font-bold text-black tracking-tight">{user.username}</h2>
                    </div>
                  </div>
                  
                  {/* Bio if available */}
                  {user.profile?.bio && (
                    <p className="text-black/80 text-sm italic border-l-2 border-black/30 pl-4">
                      "{user.profile.bio}"
                    </p>
                  )}
                </div>

                                {/* Stats Grid */}
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                    </svg>
                    <div>
                      <span className="text-black/60 text-xs uppercase tracking-wider block">Issued</span>
                      <p className="text-black font-semibold text-sm">{new Date(user.createdAt).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}</p>
                    </div>
                  </div>
                  
                  {user.memberStyle !== 'admin' && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <polyline points="12,6 12,12 16,14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div>
                        <span className="text-black/60 text-xs uppercase tracking-wider block">Expires</span>
                        <p className="text-black font-semibold text-sm">{new Date(user.expiresAt).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-black/20">
                  <div className="flex items-center gap-2">
                    <Icons.Shield className="w-4 h-4 text-black" />
                    <span className="text-black/60 text-sm">Verified Member</span>
                  </div>
                  <div className="text-black/40 text-sm">
                    ID: {user.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="lg:col-span-3 bg-gray-800/25 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <h3 className="text-xl font-medium text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/watchlist"
                  className="flex items-center justify-center gap-3 p-3 bg-gray-700/50 border border-white/10 rounded-lg hover:bg-gray-700/70 transition-colors"
                >
                  <Icons.Star className="w-5 h-5 text-white/60" />
                  <span className="text-white">View Watchlist</span>
                </Link>
                <Link
                  href="/research"
                  className="flex items-center justify-center gap-3 p-3 bg-gray-700/50 border border-white/10 rounded-lg hover:bg-gray-700/70 transition-colors"
                >
                  <Icons.Search className="w-5 h-5 text-white/60" />
                  <span className="text-white">Browse Research</span>
                </Link>
                <Link
                  href={user.memberStyle === 'free' ? "/search" : "/request"}
                  className="flex items-center justify-center gap-3 p-3 bg-gray-700/50 border border-white/10 rounded-lg hover:bg-gray-700/70 transition-colors"
                >
                  <Icons.Plus className="w-5 h-5 text-white/60" />
                  <span className="text-white">{user.memberStyle === 'free' ? 'Advanced Search' : 'Request Research'}</span>
                </Link>
                {user.memberStyle === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-center gap-3 p-3 bg-gray-700/50 border border-white/10 rounded-lg hover:bg-gray-700/70 transition-colors"
                  >
                    <Icons.Admin className="w-5 h-5 text-white/60" />
                    <span className="text-white">Admin Panel</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Compact Preferences Card */}
            <div className="lg:col-span-3 bg-gray-800/25 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Preferences</h3>
                <button
                  onClick={() => {
                    handleSave();
                    if (window.showToast) {
                      window.showToast('Preferences saved.', 'success');
                    }
                  }}
                  className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/30 text-white font-medium rounded-2xl hover:bg-white/15 hover:border-white/40 transition-all duration-300 text-sm shadow-lg"
                >
                  Save
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium text-sm">Email Notifications</span>
                    <p className="text-white/60 text-xs">Receive updates about new articles</p>
                  </div>
                  <button
                    onClick={() => setFormData({...formData, notifications: !formData.notifications})}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      formData.notifications 
                        ? 'bg-[rgb(var(--color-horizon-green))]' 
                        : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                      formData.notifications ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium text-sm">Newsletter</span>
                    <p className="text-white/60 text-xs">Weekly digest</p>
                  </div>
                  <button
                    onClick={() => setFormData({...formData, newsletter: !formData.newsletter})}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      formData.newsletter 
                        ? 'bg-[rgb(var(--color-horizon-green))]' 
                        : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                      formData.newsletter ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <div className="space-y-2">
                  <span className="text-white font-medium text-sm">Preferred Reading Level</span>
                  <div className="flex justify-center gap-1">
                    {(['novice', 'technical', 'analyst'] as const).map((level) => {
                      // Determine if this level should be available based on user membership
                      const isAvailable = 
                        user.memberStyle === 'admin' || 
                        (user.memberStyle === 'premium' && level !== 'analyst') ||
                        (user.memberStyle === 'free' && ['novice', 'technical'].includes(level));
                      
                      return (
                        <button
                          key={level}
                          onClick={() => isAvailable && setFormData({...formData, readingLevel: level})}
                          disabled={!isAvailable}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            formData.readingLevel === level
                              ? 'bg-white text-black'
                              : isAvailable
                                ? 'bg-white/10 text-white/60 hover:bg-white/20'
                                : 'bg-white/5 text-white/30 cursor-not-allowed'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information */}
              <div className="bg-gray-800/25 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-medium text-white">Profile Information</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
                  >
                    <Icons.Edit className="w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 mb-2">Username</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[rgb(var(--color-horizon-green))]"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[rgb(var(--color-horizon-green))]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[rgb(var(--color-horizon-green))] resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 mb-2">X</label>
                        <input
                          type="text"
                          value={formData.twitter}
                          onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[rgb(var(--color-horizon-green))]"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2">LinkedIn</label>
                        <input
                          type="text"
                          value={formData.linkedin}
                          onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[rgb(var(--color-horizon-green))]"
                          placeholder="linkedin.com/in/username"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black font-medium rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-white/60">Username</span>
                        <p className="text-white font-medium">{user.username}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Email</span>
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                    </div>
                    {user.profile?.bio && (
                      <div>
                        <span className="text-white/60">Bio</span>
                        <p className="text-white">{user.profile.bio}</p>
                      </div>
                    )}
                    {(user.profile?.twitter || user.profile?.linkedin) && (
                      <div>
                        <span className="text-white/60">Social Links</span>
                        <div className="flex gap-4 mt-2">
                          {user.profile?.twitter && (
                            <a
                              href={user.profile.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[rgb(var(--color-horizon-green))] hover:text-[rgb(var(--color-horizon-green))]/80 transition-colors"
                            >
                                                          <Icons.Twitter className="w-4 h-4" />
                            X
                            </a>
                          )}
                          {user.profile?.linkedin && (
                            <a
                              href={user.profile.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[rgb(var(--color-horizon-green))] hover:text-[rgb(var(--color-horizon-green))]/80 transition-colors"
                            >
                              <Icons.LinkedIn className="w-4 h-4" />
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Premium Upgrade CTA - Only for free users - Horizontal card below Profile Information */}
              {user.memberStyle === 'free' && (
                <div className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm border border-gray-700 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-1">Upgrade to Premium</h3>
                      <p className="text-white/80 text-sm">
                        Unlock exclusive research, advanced analytics, and priority support.
                      </p>
                    </div>
                    <Link
                      href="/premium"
                      className="inline-flex items-center gap-2 px-7 py-2.5 bg-[rgb(var(--color-horizon-green))] text-black font-medium rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      <Icons.ArrowRight className="w-4 h-4" />
                      Learn More
                    </Link>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">

              {/* Premium Features - Only for premium users */}
              {user.memberStyle === 'premium' && (
                <div className="bg-gray-800/25 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-medium text-white mb-4">Premium Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Icons.Star className="w-5 h-5 text-black" />
                      <span className="text-white text-sm">Unlock "Analyst" Writing Style</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Search className="w-5 h-5 text-black" />
                      <span className="text-white text-sm">Request Research</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Eye className="w-5 h-5 text-black" />
                      <span className="text-white text-sm">Access to Videos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Star className="w-5 h-5 text-black" />
                      <span className="text-white text-sm">Create Watchlist</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Support className="w-5 h-5 text-black" />
                      <span className="text-white text-sm">Premium Support</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Free Features - Only for free users */}
              {user.memberStyle === 'free' && (
                <div className="bg-gray-800/25 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-medium text-white mb-4">Free Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Icons.Search className="w-5 h-5 text-black" />
                      <span className="text-white text-sm">Research Scope</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 text-black">
                        <Icons.Info />
                      </div>
                      <span className="text-white text-sm">Weekly Newsletter</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Users className="w-5 h-5 text-black" />
                      <span className="text-white text-sm">Comment & Interact with Experts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 text-black">
                        <Icons.Grid />
                      </div>
                      <span className="text-white text-sm">Novice & Technical Writing Styles</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Features - Only for admin users */}
              {user.memberStyle === 'admin' && (
                <div className="bg-gray-800/25 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-medium text-white mb-4">Admin Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Icons.Admin className="w-5 h-5 text-black" />
                      <span className="text-white text-sm">Content Management</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Users className="w-5 h-5 text-black" />
                      <span className="text-white text-sm">User Management</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Shield className="w-5 h-5 text-black" />
                      <span className="text-white text-sm">System Access</span>
                    </div>
                  </div>
                </div>
              )}

              {/* About Horizon */}
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-3 rounded-full px-6 py-4 text-lg font-light tracking-[-0.01em] bg-white/71 border border-white w-full transition-all duration-300 hover:bg-white/80 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm hover:scale-105"
              >
                <span className="text-white group-hover:text-black transition-colors duration-300 text-xl">
                  <Icons.Info />
                </span>
                <span className="text-white group-hover:text-[#3c3c3c] transition-colors duration-300">About Horizon</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
      
      {/* Bottom spacing - 20% of screen height */}
      <div className="h-[20vh]"></div>

      {/* Profile Picture Upload Modal */}
      <ProfileUploadModal
        isOpen={showUploadModal}
        onClose={closeUploadModal}
        onUpload={handleUpload}
        isUploading={isUploading}
      />
    </div>
  );
}
