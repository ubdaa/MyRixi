'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Screenshots = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const screenshots = [
    { 
      src: "/images/screenshot-1.png", 
      alt: "Écran d'accueil MyRixi", 
      caption: "Page d'accueil avec découverte communautaire" 
    },
    { 
      src: "/images/screenshot-2.png", 
      alt: "Profil utilisateur MyRixi", 
      caption: "Profil personnalisable avec thème cybernétique" 
    },
    { 
      src: "/images/screenshot-3.png", 
      alt: "Page communauté MyRixi", 
      caption: "Interface de communauté avec flux de contenu" 
    },
    { 
      src: "/images/screenshot-4.png", 
      alt: "Messagerie MyRixi", 
      caption: "Système de messagerie avec design néon" 
    },
    { 
      src: "/images/screenshot-5.png", 
      alt: "Paramètres MyRixi", 
      caption: "Page de personnalisation et paramètres" 
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="screenshots" className="py-20 bg-black relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-4">
            <span className="text-gradient">Captures </span>
            <span className="neon-glow-primary">d&apos;écran</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explorez l&apos;interface innovante et immersive de MyRixi à travers ces captures d&apos;écran.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Slider */}
          <div className="relative h-[600px] overflow-hidden rounded-3xl mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-[280px] h-[570px]">
                  {/* Phone frame */}
                  <div className="absolute inset-0 bg-gray-800 rounded-[40px] shadow-xl">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-xl"></div>
                  </div>
                  
                  {/* Screenshot */}
                  <div className="absolute inset-2 rounded-[35px] overflow-hidden">
                    <Image
                      src={screenshots[currentIndex].src}
                      alt={screenshots[currentIndex].alt}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-[35px]"
                    />
                  </div>
                  
                  {/* Caption */}
                  <div className="absolute -bottom-16 left-0 right-0 text-center">
                    <p className="text-lg text-white">{screenshots[currentIndex].caption}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition-all"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition-all"
              aria-label="Next screenshot"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-2 mt-10">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index 
                    ? 'bg-primary scale-125' 
                    : 'bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Screenshots;