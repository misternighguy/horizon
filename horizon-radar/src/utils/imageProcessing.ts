export interface ImageCompressionOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: 'jpeg' | 'webp';
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an image file for upload
 */
export const validateImageFile = (file: File, maxSizeMB: number = 5): ImageValidationResult => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Please select an image file (JPEG, PNG, WebP, etc.)'
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Image size must be less than ${maxSizeMB}MB`
    };
  }

  return { isValid: true };
};

/**
 * Compresses and resizes an image file
 */
export const compressImage = (
  file: File, 
  options: Partial<ImageCompressionOptions> = {}
): Promise<string> => {
  const defaultOptions: ImageCompressionOptions = {
    maxWidth: 256,
    maxHeight: 256,
    quality: 0.8,
    format: 'jpeg'
  };

  const finalOptions = { ...defaultOptions, ...options };

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions maintaining aspect ratio
        const { maxWidth, maxHeight } = finalOptions;
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        // Set canvas size
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw image maintaining aspect ratio and centering
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        ctx?.drawImage(img, startX, startY, size, size, 0, 0, newWidth, newHeight);

        // Convert to data URL
        const mimeType = finalOptions.format === 'webp' ? 'image/webp' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(mimeType, finalOptions.quality);
        
        resolve(compressedDataUrl);
      } catch (error) {
        reject(new Error('Failed to process image'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generates user initials for avatar fallback
 */
export const generateInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Creates a data URL for initials avatar
 */
export const createInitialsAvatar = (
  initials: string, 
  size: number = 96,
  backgroundColor: string = '#95EC6E',
  textColor: string = '#000000'
): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = size;
  canvas.height = size;

  if (!ctx) return '';

  // Draw background circle
  ctx.fillStyle = backgroundColor;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Draw initials
  ctx.fillStyle = textColor;
  ctx.font = `bold ${size * 0.4}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size / 2, size / 2);

  return canvas.toDataURL('image/png');
};
