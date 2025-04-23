'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download, ArrowRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;

      const { clientX, clientY } = e;
      const { width, height, left, top } = heroRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the hero section
      const x = (clientX - left - width / 2) / 25;
      const y = (clientY - top - height / 2) / 25;
      
      // Apply parallax effect to elements
      const elements = heroRef.current.querySelectorAll('.parallax-element');
      elements.forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.speed || '1');
        (el as HTMLElement).style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
      
      // Apply parallax effect to background
      heroRef.current.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-cyber-shapes"
      style={{
        backgroundImage: `url('/images/hero-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Floating geometric elements that respond to mouse movement */}
      <div className="absolute inset-0">
        {/* Large glowing circle */}
        <div 
          className="absolute right-[15%] top-[20%] w-64 h-64 rounded-full opacity-20 blur-3xl parallax-element"
          data-speed="1.5"
          style={{ 
            background: 'radial-gradient(circle, rgba(0,214,125,0.6) 0%, rgba(0,214,125,0) 70%)'
          }}
        ></div>
        
        {/* Pink/purple glow */}
        <div 
          className="absolute left-[10%] bottom-[30%] w-72 h-72 rounded-full opacity-20 blur-3xl parallax-element"
          data-speed="2"
          style={{ 
            background: 'radial-gradient(circle, rgba(255,79,154,0.5) 0%, rgba(138,46,255,0.2) 50%, transparent 70%)'
          }}
        ></div>
        
        {/* Hexagonal shape */}
        <div 
          className="absolute top-[25%] left-[20%] w-40 h-40 opacity-10 parallax-element"
          data-speed="1.2"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            border: '1px solid rgba(0,214,125,0.5)',
            transform: 'rotate(15deg)'
          }}
        ></div>
        
        {/* Small tech shape */}
        <div 
          className="absolute bottom-[20%] right-[25%] w-24 h-24 opacity-15 parallax-element"
          data-speed="2.2"
          style={{ 
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
            border: '1px solid rgba(24,160,251,0.6)',
            transform: 'rotate(-10deg)'
          }}
        ></div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background2/50 glass rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-synth-green animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">Nouvelle expérience communautaire</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="neon-glow-primary">Rejoignez la révolution</span>
              <br />
              <span className="text-gradient">communautaire</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground-secondary mb-8">
              Découvrez MyRixi, l&apos;app qui connecte les passions. 
              <br className="hidden md:block" /> 
              <span className="italic text-foreground">Un design futuriste. Une communauté vivante. Une expérience unique.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                className="glass border-glow-pink text-white font-medium py-6 px-8 rounded-lg text-lg hover:brightness-125 transition-all gap-2"
                size="lg"
              >
                <Download className="w-5 h-5" />
                Télécharger l&apos;app
              </Button>
              
              <Button 
                className="bg-background2/30 backdrop-blur-sm text-white font-medium py-6 px-8 rounded-lg text-lg hover:bg-background2/50 transition-all gap-2 border-[1px] border-divider"
                variant="outline"
                size="lg"
                asChild
              >
                <Link href="#about">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
              {/* Animated glow effects */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 rounded-full blur-3xl opacity-20 parallax-element"
                data-speed="1.5"
                style={{ 
                  background: 'radial-gradient(ellipse at center, rgba(255,79,154,0.5) 0%, rgba(138,46,255,0.3) 50%, transparent 70%)'
                }}
              ></div>
              
              <div className="absolute inset-0 bg-gradient-cyber opacity-30 blur-2xl -z-10 animate-pulse parallax-element" data-speed="0.5"></div>
              
              {/* Phone mockup */}
              <div className="relative parallax-element" data-speed="0.8">
                <Image
                  src="/images/phone-mockup.png"
                  alt="MyRixi App Interface"
                  width={400}
                  height={800}
                  className="relative z-10 drop-shadow-2xl"
                />
                
                {/* Decorative elements around the phone */}
                <div className="absolute top-0 right-0 -mt-5 -mr-5 w-20 h-20 opacity-40 parallax-element" data-speed="2">
                  <div className="absolute inset-0 border-2 border-synth-green rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                </div>
                
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-16 h-16 opacity-40 parallax-element" data-speed="1.8">
                  <div className="absolute inset-0 border-2 border-cyber-pink rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.a 
        href="#about"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-all ${
          scrolled ? 'opacity-0' : 'animate-bounce opacity-100'
        }`}
      >
        <ChevronDown size={32} />
      </motion.a>
    </section>
  );
};

export default Hero;