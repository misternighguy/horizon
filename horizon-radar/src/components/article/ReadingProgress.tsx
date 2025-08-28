'use client';

interface ReadingProgressProps {
  progress: number;
}

export default function ReadingProgress({ progress }: ReadingProgressProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-30">
      <div 
        className="h-full bg-gradient-to-r from-[rgb(var(--color-horizon-green))] to-[rgb(var(--color-horizon-green))]/80 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
