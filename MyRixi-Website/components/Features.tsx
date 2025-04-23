'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Search, 
  MessageCircle, 
  PaintBucket, 
  Globe, 
  Smartphone,
  Zap
} from 'lucide-react';

// Palette de couleurs par fonctionnalité
const featureColors = {
  discovery: "#00D67D", // synth-green
  social: "#FF4F9A",    // cyber-pink
  profiles: "#8A2EFF",  // neo-purple
  interface: "#18A0FB", // techno-blue
  performance: "#FBC02D" // solar-gold
};

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Découverte de communautés",
      description: "Explorez et trouvez des communautés qui correspondent à vos passions et intérêts grâce à notre système de recherche intelligent.",
      image: "/images/feature-discovery.png",
      color: featureColors.discovery
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Publications & commentaires",
      description: "Partagez du contenu, commentez et interagissez avec d'autres membres de votre communauté grâce à notre système de publication intuitif.",
      image: "/images/feature-comments.png",
      color: featureColors.social
    },
    {
      icon: <PaintBucket className="w-6 h-6" />,
      title: "Profils personnalisables",
      description: "Créez un profil unique avec des avatars personnalisables et des thèmes qui reflètent votre identité dans l'univers MyRixi.",
      image: "/images/feature-profiles.png",
      color: featureColors.profiles
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "UI néo-glassmorphique",
      description: "Naviguez dans une interface utilisateur futuriste avec des effets de transparence et de flou qui créent une expérience immersive.",
      image: "/images/feature-ui.png",
      color: featureColors.interface
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Application mobile fluide",
      description: "Profitez d'une application mobile réactive et intuitive, développée avec React Native et Expo pour une expérience utilisateur optimale.",
      image: "/images/feature-mobile.png",
      color: featureColors.performance
    }
  ];

  const handleFeatureClick = (index: number) => {
    setActiveFeature(index);
    // Scroll la section en vue sur mobile
    if (window.innerWidth < 768 && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section 
      id="fonctionnalites" 
      className="py-24 relative overflow-hidden bg-background1"
      ref={containerRef}
    >
      {/* Éléments décoratifs subtils */}
      <div className="absolute inset-0 cyber-grid opacity-5 -z-50"></div>
      
      {/* Lignes de circuit cybernétiques */}
      <div className="absolute top-0 left-0 h-px w-2/3 bg-gradient-to-r from-synth-green/20 to-transparent"></div>
      <div className="absolute top-0 right-0 h-40 w-px bg-gradient-to-b from-cyber-pink/20 to-transparent"></div>
      <div className="absolute bottom-0 right-0 h-px w-2/3 bg-gradient-to-l from-techno-blue/20 to-transparent"></div>
      <div className="absolute bottom-0 left-10 h-40 w-px bg-gradient-to-t from-neo-purple/20 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background2/50 rounded-full mb-4">
            <Zap size={16} className="text-synth-green" />
            <span className="text-sm font-medium text-foreground">Conçu pour l&apos;expérience utilisateur</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Fonctionnalités </span>
            <span className="neon-glow-secondary">principales</span>
          </h2>
          
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            Découvrez ce qui fait de MyRixi une application de communauté unique avec son interface futuriste et ses fonctionnalités innovantes.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Feature Visual - Toujours affiché en haut sur mobile, à droite sur desktop */}
          <div className="w-full lg:w-1/2 lg:order-2 relative">
            <div className="relative flex items-center justify-center h-[500px] max-w-[350px] mx-auto">
              {/* Effets décoratifs autour de l'image */}
              <div 
                className="absolute inset-0 rounded-3xl blur-2xl opacity-20 transition-all duration-500"
                style={{ backgroundColor: features[activeFeature].color + '33' }} // Ajout d'opacité en hex
              ></div>
              
              {/* Phone frame */}
              <div className="absolute inset-0 rounded-3xl border border-divider overflow-hidden bg-background2/40">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-8 bg-background2/80 rounded-b-xl z-20"></div>
              </div>
              
              {/* Image du téléphone avec animation */}
              <div className="relative h-full w-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-4 rounded-2xl overflow-hidden glass border border-divider shadow-lg"
                  >
                    {/* Fallback si l'image ne se charge pas */}
                    <div className="absolute inset-0 bg-background2 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-t-synth-green border-b-neo-purple border-l-cyber-pink border-r-techno-blue rounded-full animate-spin"></div>
                    </div>
                    
                    <Image
                      src={features[activeFeature].image}
                      alt={features[activeFeature].title}
                      fill
                      sizes="(max-width: 768px) 90vw, 350px"
                      className="object-cover z-10"
                      priority={activeFeature === 0}
                    />
                    
                    {/* Overlay avec info */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background1/90 to-transparent z-20"
                      style={{ 
                        borderTop: `1px solid ${features[activeFeature].color}33`
                      }}
                    >
                      <h4 
                        className="text-xl font-bold"
                        style={{ color: features[activeFeature].color }}
                      >
                        {features[activeFeature].title}
                      </h4>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* Feature Selection - Toujours affiché en bas sur mobile, à gauche sur desktop */}
          <div className="w-full lg:w-1/2 lg:order-1">
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => handleFeatureClick(index)}
                  className={`w-full text-left p-6 rounded-lg border transition-all duration-300 ${
                    activeFeature === index 
                      ? 'bg-background2/50 border-l-4'
                      : 'bg-background2/20 border-transparent hover:bg-background2/30'
                  }`}
                  style={{
                    borderLeftColor: activeFeature === index ? feature.color : 'transparent'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: feature.color + '20',
                        color: feature.color
                      }}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-1" style={{ 
                        color: activeFeature === index ? feature.color : 'inherit'
                      }}>
                        {feature.title}
                      </h3>
                      <p className={`text-sm ${activeFeature === index ? 'text-foreground-secondary' : 'text-foreground-secondary/70'}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Petite barre d'indicateurs pour mobile (points) */}
        <div className="flex justify-center gap-2 mt-10 lg:hidden">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className="w-2.5 h-2.5 rounded-full transition-all"
              style={{ 
                backgroundColor: activeFeature === index 
                  ? features[index].color 
                  : 'rgba(255, 255, 255, 0.2)' 
              }}
              aria-label={`Voir fonctionnalité ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;