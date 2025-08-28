'use client';

import { useState } from 'react';
import { generateInitials, createInitialsAvatar } from '@/utils/imageProcessing';

export interface ProfilePictureProps {
  src?: string;
  alt: string;
  username?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showUploadOverlay?: boolean;
  showVerification?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16'
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
};

export default function ProfilePicture({
  src,
  alt,
  username,
  size = 'md',
  onClick,
  showUploadOverlay = false,
  className = ''
}: ProfilePictureProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Generate fallback avatar
  const getFallbackAvatar = () => {
    if (username) {
      const initials = generateInitials(username);
      return createInitialsAvatar(initials);
    }
    return '/images/default-avatar.svg';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const imageSrc = imageError || !src ? getFallbackAvatar() : src;

  return (
    <div
      className={`relative group ${sizeClasses[size]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Simple Clickable Button */}
      <button
        onClick={() => {
          console.log('ProfilePicture button clicked!', { onClick: !!onClick });
          onClick?.();
        }}
        className={`w-full h-full p-0 border-0 bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 ${
          onClick ? 'cursor-pointer' : 'cursor-default'
        }`}
        disabled={!onClick}
      >
        {/* Main Image */}
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full rounded-lg object-cover border-2 border-black/20 shadow-lg transition-all duration-200 ${
            isHovered && onClick ? 'opacity-80' : ''
          }`}
          onError={handleImageError}
        />
      </button>

      {/* Upload Overlay */}
      {showUploadOverlay && onClick && (
        <div 
          className={`absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 pointer-events-none ${
            isHovered ? 'opacity-100' : ''
          }`}
        >
          <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-white text-xs font-medium">Choose PFP</span>
        </div>
      )}

      {/* Fallback Initials (if no image and username provided) */}
      {!src && username && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#95EC6E] to-[#E4B74D] rounded-lg flex items-center justify-center">
          <span className={`font-bold text-black ${textSizes[size]}`}>
            {generateInitials(username)}
          </span>
        </div>
      )}
    </div>
  );
}
