'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;

      const { clientX, clientY } = e;
      const { width, height, left, top } = heroRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the hero section
      const x = (clientX - left - width / 2) / 25;
      const y = (clientY - top - height / 2) / 25;
      
      // Apply parallax effect to background
      heroRef.current.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden cyber-grid"
      style={{
        backgroundImage: `url('/images/hero-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-cyber font-bold mb-4 neon-glow-primary">
              Rejoignez la révolution communautaire
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Découvrez MyRixi, l&apos;app qui connecte les passions. 
              <br className="hidden md:block" /> 
              <span className="italic text-gradient">Un design futuriste. Une communauté vivante. Une expérience unique.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                className="glass border-glow text-white font-medium py-6 px-8 rounded-lg text-lg hover:brightness-125 transition-all"
                size="lg"
              >
                Télécharger l&apos;app
              </Button>
              
              <Button 
                className="bg-white/10 backdrop-blur-sm text-white font-medium py-6 px-8 rounded-lg text-lg hover:bg-white/20 transition-all"
                variant="outline"
                size="lg"
              >
                En savoir plus
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative w-full max-w-md mx-auto">
              <Image
                src="/images/phone-mockup.png"
                alt="MyRixi App Interface"
                width={400}
                height={800}
                className="relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-30 blur-xl -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.a 
        href="#about"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white animate-bounce"
      >
        <ChevronDown size={32} />
      </motion.a>
    </section>
  );
};

export default Hero;