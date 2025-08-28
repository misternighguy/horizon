'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in (30% faster - reduced from 10ms to 7ms)
    const timer = setTimeout(() => setIsVisible(true), 7);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-dismiss (30% faster - reduced from 2000ms to 1400ms)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 210); // Wait for fade out (30% faster - reduced from 300ms to 210ms)
    }, toast.duration || 1400);
    
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        transform transition-all duration-210 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        backdrop-blur-md bg-white/20 border border-white/30 rounded-full shadow-xl px-6 py-3 mb-2
        flex items-center justify-between min-w-[300px] max-w-md
        hover:bg-white/30 transition-all duration-200
      `}
    >
      <span className="text-white text-sm font-medium">{toast.message}</span>
              <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onRemove(toast.id), 210);
          }}
          className="ml-3 text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Expose global toast function
    (window as { showToast?: (message: string, type: Toast['type'], duration?: number) => void }).showToast = (message: string, type: Toast['type'] = 'success', duration?: number) => {
      const newToast: Toast = {
        id: Date.now().toString(),
        message,
        type,
        duration
      };
      setToasts(prev => [...prev, newToast]);
    };

    return () => {
      delete (window as { showToast?: (message: string, type: Toast['type'], duration?: number) => void }).showToast;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
}
