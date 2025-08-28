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
  showVerification = false,
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
      {/* Main Image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full rounded-lg object-cover border-2 border-black/20 shadow-lg transition-all duration-200 ${
          onClick ? 'cursor-pointer' : ''
        } ${isHovered && onClick ? 'opacity-80' : ''}`}
        onClick={onClick}
        onError={handleImageError}
      />

      {/* Upload Overlay */}
      {showUploadOverlay && onClick && (
        <div 
          className={`absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center ${
            isHovered ? 'opacity-100' : ''
          }`}
        >
          <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
      )}

      {/* Verification Badge */}
      {showVerification && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black/20 rounded-full border border-black/30 flex items-center justify-center">
          <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
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
