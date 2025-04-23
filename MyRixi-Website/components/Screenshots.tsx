'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MonitorSmartphone } from 'lucide-react';

const Screenshots = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  const screenshots = [
    { 
      src: "/images/screenshot-1.png", 
      alt: "Écran d'accueil MyRixi", 
      caption: "Page d'accueil avec découverte communautaire",
      color: "#00D67D" // synth-green
    },
    { 
      src: "/images/screenshot-2.png", 
      alt: "Profil utilisateur MyRixi", 
      caption: "Profil personnalisable avec thème cybernétique",
      color: "#FF4F9A" // cyber-pink
    },
    { 
      src: "/images/screenshot-3.png", 
      alt: "Page communauté MyRixi", 
      caption: "Interface de communauté avec flux de contenu",
      color: "#8A2EFF" // neo-purple
    },
    { 
      src: "/images/screenshot-4.png", 
      alt: "Messagerie MyRixi", 
      caption: "Système de messagerie avec design néon",
      color: "#18A0FB" // techno-blue
    },
    { 
      src: "/images/screenshot-5.png", 
      alt: "Paramètres MyRixi", 
      caption: "Page de personnalisation et paramètres",
      color: "#FBC02D" // solar-gold
    },
  ];

  // Autoplay avec intervalle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoplay) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [currentIndex, autoplay]);

  // Désactive l'autoplay temporairement lors d'une interaction manuelle
  const pauseAutoplay = () => {
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000); // Réactive après 10s
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    pauseAutoplay();
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    if (index !== currentIndex) {
      pauseAutoplay();
      setCurrentIndex(index);
    }
  };

  return (
    <section id="screenshots" className="py-24 bg-background1 relative overflow-hidden">
      {/* Éléments décoratifs subtils */}
      <div className="absolute inset-0 cyber-grid opacity-5 -z-50"></div>
      
      {/* Lignes cybernétiques */}
      <div className="absolute top-0 left-1/3 w-px h-32 bg-gradient-to-b from-synth-green/20 to-transparent -z-40"></div>
      <div className="absolute bottom-0 right-1/3 w-px h-32 bg-gradient-to-t from-neo-purple/20 to-transparent -z-40"></div>

      {/* Fond dynamique */}
      <div 
        className="absolute inset-0 opacity-5 transition-all duration-1000 -z-30"
        style={{ 
          background: `radial-gradient(circle at center, ${screenshots[currentIndex].color}33 0%, transparent 50%)` 
        }}
      ></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background2/50 rounded-full mb-4">
            <MonitorSmartphone size={16} className="text-cyber-pink" />
            <span className="text-sm font-medium text-foreground">Interface utilisateur</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Captures </span>
            <span className="neon-glow-primary">d&apos;écran</span>
          </h2>
          
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            Explorez l&apos;interface innovante et immersive de MyRixi à travers ces captures d&apos;écran.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Slider principal */}
          <div className="relative h-[500px] sm:h-[600px] overflow-hidden mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-[270px] h-[550px]">
                  {/* Frame du téléphone */}
                  <motion.div 
                    className="absolute inset-0 bg-background2 rounded-[40px] shadow-xl border border-divider"
                    animate={{ 
                      boxShadow: `0 0 30px ${screenshots[currentIndex].color}20`
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Encoche du téléphone */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-background1 rounded-b-xl"></div>
                    
                    {/* Boutons latéraux simulés */}
                    <div className="absolute top-32 right-[-5px] w-2 h-10 bg-background1 rounded-l-md"></div>
                    <div className="absolute top-48 right-[-5px] w-2 h-10 bg-background1 rounded-l-md"></div>
                    <div className="absolute top-32 left-[-5px] w-2 h-16 bg-background1 rounded-r-md"></div>
                  </motion.div>
                  
                  {/* Zone de la capture d'écran */}
                  <div className="absolute inset-3 rounded-[35px] overflow-hidden">
                    {/* Fallback avant chargement d'image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-background2">
                      <div className="w-10 h-10 border-4 border-t-synth-green border-r-cyber-pink border-b-neo-purple border-l-techno-blue rounded-full animate-spin"></div>
                    </div>
                    
                    <Image
                      src={screenshots[currentIndex].src}
                      alt={screenshots[currentIndex].alt}
                      fill
                      sizes="(max-width: 768px) 270px, 270px"
                      priority={currentIndex === 0}
                      style={{ objectFit: "cover" }}
                      className="rounded-[35px]"
                    />
                  </div>
                  
                  {/* Légende avec animation */}
                  <motion.div 
                    className="absolute -bottom-20 left-0 right-0 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <p 
                      className="text-lg font-medium"
                      style={{ color: screenshots[currentIndex].color }}
                    >
                      {screenshots[currentIndex].caption}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Boutons de navigation */}
            <div className="absolute -left-5 sm:left-10 top-1/2 transform -translate-y-1/2">
              <button 
                onClick={prevSlide}
                className="glass p-3 rounded-full border border-divider hover:border-cyber-pink transition-all"
                aria-label="Capture d'écran précédente"
              >
                <ChevronLeft className="w-6 h-6 text-cyber-pink" />
              </button>
            </div>
            
            <div className="absolute -right-5 sm:right-10 top-1/2 transform -translate-y-1/2">
              <button 
                onClick={nextSlide}
                className="glass p-3 rounded-full border border-divider hover:border-cyber-pink transition-all"
                aria-label="Capture d'écran suivante"
              >
                <ChevronRight className="w-6 h-6 text-cyber-pink" />
              </button>
            </div>
          </div>

          {/* Miniatures améliorées */}
          <div className="flex justify-center gap-4 mt-16">
            {screenshots.map((screenshot, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative group"
                aria-label={`Aller à la capture d'écran ${index + 1}: ${screenshot.alt}`}
              >
                <div 
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentIndex === index 
                      ? 'border-[color:var(--cyber-pink)]' 
                      : 'border-divider group-hover:border-foreground-secondary'
                  }`}
                >
                  <div className="absolute inset-0 bg-background2 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-t-synth-green border-r-cyber-pink border-b-neo-purple border-l-techno-blue rounded-full animate-spin"></div>
                  </div>
                  <Image
                    src={screenshot.src}
                    alt={`Miniature: ${screenshot.alt}`}
                    fill
                    sizes="80px"
                    style={{ objectFit: "cover" }}
                    className={`transition-all ${currentIndex === index ? 'brightness-100' : 'brightness-50 group-hover:brightness-75'}`}
                  />
                </div>
                
                {/* Indicateur actif */}
                {currentIndex === index && (
                  <motion.div 
                    layoutId="activeScreenshot"
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 rounded-full"
                    style={{ backgroundColor: screenshot.color }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Screenshots;