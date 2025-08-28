import { useState } from 'react';

interface UseProfilePictureProps {
  onUploadSuccess?: (imageDataUrl: string) => void;
  onUploadError?: (error: string) => void;
}

export function useProfilePicture({ onUploadSuccess, onUploadError }: UseProfilePictureProps = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUpload = async (imageDataUrl: string) => {
    try {
      setIsUploading(true);
      
      // Call success handler
      onUploadSuccess?.(imageDataUrl);
      
      // Close modal
      setShowUploadModal(false);
      
      // Show success message
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('Profile picture updated successfully!', 'success', 3000);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      const errorMessage = 'Error uploading image. Please try again.';
      onUploadError?.(errorMessage);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(errorMessage, 'error', 4000);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const openUploadModal = () => {
    console.log('openUploadModal called, setting showUploadModal to true');
    setShowUploadModal(true);
    console.log('showUploadModal state should now be true');
  };
  const closeUploadModal = () => setShowUploadModal(false);

  return {
    isUploading,
    showUploadModal,
    handleUpload,
    openUploadModal,
    closeUploadModal
  };
}
