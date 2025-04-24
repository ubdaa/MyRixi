'use client';

export default function LoadingDocs() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative w-20 h-20">
        {/* Animation de chargement cyberpunk */}
        <div className="absolute inset-0 border-t-4 border-r-4 border-transparent border-l-4 border-b-4 border-synth-green rounded-full animate-spin"></div>
        <div className="absolute inset-1 border-t-4 border-transparent border-r-4 border-neo-purple border-l-4 border-b-4 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className="absolute inset-3 border-t-4 border-r-4 border-transparent border-l-4 border-cyber-pink border-b-4 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
      </div>
      <p className="mt-6 text-foreground-secondary text-center">
        Chargement de la documentation API<span className="animate-pulse">...</span>
      </p>
    </div>
  );
}