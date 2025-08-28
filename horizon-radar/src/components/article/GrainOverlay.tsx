'use client';

export default function GrainOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <div 
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: 'var(--grain-overlay)' }}
      ></div>
    </div>
  );
}
