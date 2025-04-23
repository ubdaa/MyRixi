'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Search, MessageCircle, PaintBucket, Globe, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Découverte de communautés",
      description: "Explorez et trouvez des communautés qui correspondent à vos passions et intérêts grâce à notre système de recherche intelligent.",
      image: "/images/feature-discovery.png"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Publications & commentaires",
      description: "Partagez du contenu, commentez et interagissez avec d'autres membres de votre communauté grâce à notre système de publication intuitif.",
      image: "/images/feature-comments.png"
    },
    {
      icon: <PaintBucket className="w-6 h-6" />,
      title: "Profils personnalisables",
      description: "Créez un profil unique avec des avatars personnalisables et des thèmes qui reflètent votre identité dans l'univers MyRixi.",
      image: "/images/feature-profiles.png"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "UI néo-glassmorphique",
      description: "Naviguez dans une interface utilisateur futuriste avec des effets de transparence et de flou qui créent une expérience immersive.",
      image: "/images/feature-ui.png"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Application mobile fluide",
      description: "Profitez d'une application mobile réactive et intuitive, développée avec React Native et Expo pour une expérience utilisateur optimale.",
      image: "/images/feature-mobile.png"
    }
  ];

  return (
    <section id="fonctionnalites" className="py-20 bg-gradient-to-b from-background to-black">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-4">
            <span className="text-gradient">Fonctionnalités </span>
            <span className="neon-glow-secondary">principales</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Découvrez ce qui fait de MyRixi une application de communauté unique avec son interface futuriste et ses fonctionnalités innovantes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Feature Navigation */}
          <div className="order-2 md:order-1">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Button
                  variant="ghost"
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left justify-start mb-4 p-6 rounded-lg transition-all ${
                    activeFeature === index 
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-l-4 border-primary' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      activeFeature === index ? 'bg-primary/20' : 'bg-gray-800'
                    }`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                      <p className={`text-sm ${activeFeature === index ? 'text-gray-300' : 'text-gray-400'}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
          
          {/* Feature Visual */}
          <div className="order-1 md:order-2 relative h-[400px] md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl opacity-30"></div>
            <div className="relative h-full w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="glass rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative"
                >
                  <Image
                    src={features[activeFeature].image}
                    alt={features[activeFeature].title}
                    width={300}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h4 className="text-xl font-bold">{features[activeFeature].title}</h4>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;