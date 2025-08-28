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
      {/* Clickable Profile Picture */}
      <button
        onClick={onClick}
        className={`w-full h-full rounded-lg overflow-hidden transition-all duration-200 relative border-2 ${
          onClick ? 'cursor-pointer hover:opacity-80 border-blue-400 hover:border-blue-500' : 'cursor-default border-transparent'
        }`}
        disabled={!onClick}
      >
        {/* Main Image or Fallback */}
        {src && !imageError ? (
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : username ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
            <span className={`font-bold text-white ${textSizes[size]}`}>
              {generateInitials(username)}
            </span>
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
      </button>

      {/* Upload Overlay */}
      {showUploadOverlay && onClick && (
        <div 
          className={`absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none ${
            isHovered ? 'opacity-100' : ''
          }`}
        >
          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
