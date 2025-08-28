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
        alert('Profile picture updated successfully!');
      }, 100);
      
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      const errorMessage = 'Error uploading image. Please try again.';
      onUploadError?.(errorMessage);
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const openUploadModal = () => setShowUploadModal(true);
  const closeUploadModal = () => setShowUploadModal(false);

  return {
    isUploading,
    showUploadModal,
    handleUpload,
    openUploadModal,
    closeUploadModal
  };
}
