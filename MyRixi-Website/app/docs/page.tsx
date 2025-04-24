// app/docs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ApiDocumentation from '@/components/ApiDocumentation';
import LoadingDocs from '@/components/LoadingDocs';

export default function DocsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un temps de chargement minimal pour éviter un flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-cyber-shapes">
      {/* Formes cyberpunk en arrière-plan */}
      <div className="cyber-shape cyber-shape-1"></div>
      <div className="cyber-shape cyber-shape-2"></div>
      <div className="cyber-shape cyber-shape-3"></div>
      <div className="cyber-shape cyber-shape-4"></div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient">API Documentation</h1>
          <p className="text-foreground-secondary max-w-3xl">
            Explorez l&apos;API MyRixi et commencez à intégrer nos services dans vos applications.
          </p>
        </div>
        
        <div className="glass p-4 md:p-6 mb-8 pt-14">
          {isLoading ? (
            <LoadingDocs />
          ) : (
            <ApiDocumentation />
          )}
        </div>
      </div>
    </div>
  );
}