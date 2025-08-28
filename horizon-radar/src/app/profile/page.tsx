'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
    newsletter: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to compress and resize image
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas size to 256x256 (HD quality, reasonable file size)
        canvas.width = 256;
        canvas.height = 256;
        
        // Draw image maintaining aspect ratio and centering
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
        
        ctx?.drawImage(img, startX, startY, size, size, 0, 0, 256, 256);
        
        // Convert to base64 with quality 0.8 (good balance of quality and size)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Function to handle profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const compressedImage = await compressImage(file);
      
      // Update user profile with new avatar
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          avatar: compressedImage
        }
      };
      
      // Save to localStorage
      const localStorageDB = (window as any).localStorageDB;
      if (localStorageDB) {
        localStorageDB.updateUser(updatedUser);
        setUser(updatedUser);
      }
      
      // Close modal and show success
      setShowUploadModal(false);
      setTimeout(() => {
        alert('Profile picture updated successfully!');
      }, 100);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle file selection from modal
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const loadUserData = () => {
      try {
        const localStorageDB = (window as any).localStorageDB;
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
              newsletter: userData.preferences?.newsletter ?? true
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
      const localStorageDB = (window as any).localStorageDB;
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
            notifications: formData.notifications,
            newsletter: formData.newsletter
          }
        };
        
        localStorageDB.updateUser(user.id, updatedUser);
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
            <div className="lg:col-span-4 relative overflow-hidden rounded-2xl group transition-all duration-300" id="goldCard" style={{ transformStyle: 'preserve-3d' }}>
              {/* 3D Golden to Obsidian Background */}
              <div className="absolute inset-0 bg-gradient-radial from-yellow-400 via-amber-600 to-gray-900 rounded-2xl shadow-2xl" />
              
              {/* 3D Depth Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40 rounded-2xl" />
              
              {/* Metallic Texture Pattern */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='metallic' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 0l20 20M20 0L0 20' stroke='%23ffffff' stroke-width='0.5' opacity='0.1'/%3E%3Cpath d='M10 0v20M0 10h20' stroke='%23ffffff' stroke-width='0.3' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23metallic)'/%3E%3C/svg%3E")`
              }} />
              
              {/* Metallic Shimmer Lines */}
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='shimmer' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0'/%3E%3Cstop offset='50%25' style='stop-color:%23ffffff;stop-opacity:0.3'/%3E%3Cstop offset='100%25' style='stop-color:%23ffffff;stop-opacity:0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23shimmer)'/%3E%3C/svg%3E")`
              }} />
              
              {/* Sci-fi glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              {/* Main Card Content */}
              <div className="relative bg-gradient-to-br from-yellow-400/90 via-yellow-500/90 to-amber-600/90 backdrop-blur-sm border border-yellow-300/50 rounded-2xl p-6 h-full shadow-xl">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  {/* Logo/Brand */}
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Horizon Radar Logo" className="w-12 h-12 object-contain" />
                    <div>
                      <h3 className="text-black/80 text-sm font-medium tracking-wider uppercase">HORIZON RADAR</h3>
                      <p className="text-black/60 text-xs">PREMIUM CARD</p>
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
                    <div className="relative group cursor-pointer" onClick={() => setShowUploadModal(true)}>
                      <img
                        src={user.profile?.avatar || '/images/default-avatar.svg'}
                        alt={`${user.username}'s profile picture`}
                        className="w-12 h-12 rounded-lg object-cover border-2 border-black/20 shadow-lg transition-all duration-200 group-hover:opacity-80"
                      />
                      {/* Upload overlay with + icon */}
                      <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                      {/* Verification badge */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black/20 rounded-full border border-black/30 flex items-center justify-center">
                        <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
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
                  href="/request"
                  className="flex items-center justify-center gap-3 p-3 bg-gray-700/50 border border-white/10 rounded-lg hover:bg-gray-700/70 transition-colors"
                >
                  <Icons.Plus className="w-5 h-5 text-white/60" />
                  <span className="text-white">Request Research</span>
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
              <h3 className="text-lg font-medium text-white mb-4">Preferences</h3>
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
                <button
                  onClick={handleSave}
                  className="w-full px-4 py-2 bg-[rgb(var(--color-horizon-green))] text-black font-medium rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors text-sm"
                >
                  Save
                </button>
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
                    className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-horizon-green))] text-black font-medium rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors"
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


            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Premium Upgrade CTA - Only for free users */}
              {user.memberStyle === 'free' && (
                <div className="bg-gradient-to-br from-[rgb(var(--color-horizon-green))] to-[rgb(var(--color-brand-400))] rounded-2xl p-6">
                  <div className="text-center">
                    <Icons.Crown />
                    <h3 className="text-xl font-medium text-black mb-2">Upgrade to Premium</h3>
                    <p className="text-black/80 mb-4">
                      Unlock exclusive research, advanced analytics, and priority support.
                    </p>
                    <Link
                      href="/premium"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-black/90 transition-colors"
                    >
                      <Icons.ArrowRight className="w-4 h-4" />
                      Learn More
                    </Link>
                  </div>
                </div>
              )}

              {/* Premium Features - Only for premium users */}
              {user.memberStyle === 'premium' && (
                <div className="bg-gray-800/25 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-medium text-white mb-4">Premium Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Icons.Star className="w-5 h-5 text-[rgb(var(--color-horizon-green))]" />
                      <span className="text-white text-sm">Unlock "Analyst" Writing Style</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Search className="w-5 h-5 text-[rgb(var(--color-horizon-green))]" />
                      <span className="text-white text-sm">Request Research</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Eye className="w-5 h-5 text-[rgb(var(--color-horizon-green))]" />
                      <span className="text-white text-sm">Access to Videos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Star className="w-5 h-5 text-[rgb(var(--color-horizon-green))]" />
                      <span className="text-white text-sm">Create Watchlist</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Support className="w-5 h-5 text-[rgb(var(--color-horizon-green))]" />
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
                      <Icons.Search className="w-5 h-5 text-[rgb(var(--color-horizon-green))]" />
                      <span className="text-white text-sm">Research Scope</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Info />
                      <span className="text-white text-sm">Weekly Newsletter</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Users />
                      <span className="text-white text-sm">Comment & Interact with Experts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Grid />
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
                      <Icons.Admin className="w-5 h-5 text-purple-400" />
                      <span className="text-white text-sm">Content Management</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Users className="w-5 h-5 text-purple-400" />
                      <span className="text-white text-sm">User Management</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icons.Shield className="w-5 h-5 text-purple-400" />
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
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Update Profile Picture</h3>
                <p className="text-white/70 text-sm">How would you like to upload a photo?</p>
              </div>

              {/* Upload Options */}
              <div className="space-y-4 mb-6">
                {/* File Upload Option */}
                <button
                  onClick={handleFileSelect}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-[rgb(var(--color-horizon-green))] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-medium">Upload from Device</div>
                    <div className="text-white/60 text-sm">Choose a photo from your computer</div>
                  </div>
                </button>

                {/* Camera Option (placeholder for future) */}
                <button
                  disabled={true}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl opacity-50 cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white/40 font-medium">Take Photo</div>
                    <div className="text-white/30 text-sm">Coming soon</div>
                  </div>
                </button>
              </div>

              {/* Loading State */}
              {isUploading && (
                <div className="mb-4 flex items-center justify-center gap-3 text-white/70">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing image...</span>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePictureUpload}
        className="hidden"
      />
    </div>
  );
}
