'use client';

import { useRef } from 'react';
import { validateImageFile, compressImage, loadPresetProfilePicture } from '@/utils/imageProcessing';

export interface ProfilePictureSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageDataUrl: string, source: 'male' | 'female' | 'custom') => void;
  isUploading?: boolean;
}

export default function ProfilePictureSelector({
  isOpen,
  onClose,
  onSelect,
  isUploading = false
}: ProfilePictureSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      // Compress image
      const compressedImage = await compressImage(file, {
        maxWidth: 256,
        maxHeight: 256,
        quality: 0.8,
        format: 'jpeg'
      });

      // Call select handler with custom source
      onSelect(compressedImage, 'custom');
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const handlePresetSelect = async (preset: 'male' | 'female') => {
    try {
      // Load the preset profile picture
      const imageDataUrl = await loadPresetProfilePicture(preset);
      onSelect(imageDataUrl, preset);
    } catch (error) {
      console.error('Error loading preset image:', error);
      alert('Error loading preset image. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Choose Profile Picture</h3>
              <p className="text-white/70 text-sm">Select a preset or upload your own image</p>
            </div>

            {/* Preset Options */}
            <div className="space-y-4 mb-6">
              {/* Male PFP Option */}
              <button
                onClick={() => handlePresetSelect('male')}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-3 p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">Male Avatar</div>
                  <div className="text-white/60 text-sm">Use MalePFP.jpeg</div>
                </div>
              </button>

              {/* Female PFP Option */}
              <button
                onClick={() => handlePresetSelect('female')}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-3 p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">Female Avatar</div>
                  <div className="text-white/60 text-sm">Use FemalePFP.jpeg</div>
                </div>
              </button>

              {/* Custom Upload Option */}
              <button
                onClick={handleFileSelect}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-3 p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-[rgb(var(--color-horizon-green))] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">Upload Custom Image</div>
                  <div className="text-white/60 text-sm">Choose your own photo</div>
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
                onClick={onClose}
                disabled={isUploading}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
