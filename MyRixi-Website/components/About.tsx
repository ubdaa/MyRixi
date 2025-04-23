'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, Users, Layout, Code, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const features = [
    {
      icon: <Layers className="w-8 h-8 text-synth-green" />,
      title: "App communautaire personnalisable",
      description: "Créez et rejoignez des communautés qui correspondent parfaitement à vos centres d'intérêt.",
      accent: "synth-green"
    },
    {
      icon: <Users className="w-8 h-8 text-cyber-pink" />,
      title: "Profils riches et immersifs",
      description: "Exprimez-vous avec des profils hautement personnalisables dans un univers cybernétique unique.",
      accent: "cyber-pink"
    },
    {
      icon: <Layout className="w-8 h-8 text-techno-blue" />,
      title: "Navigation fluide et visuelle",
      description: "Une interface utilisateur intuitive et futuriste pour une expérience utilisateur sans précédent.",
      accent: "techno-blue"
    },
    {
      icon: <Code className="w-8 h-8 text-neo-purple" />,
      title: "Design cybernétique accessible",
      description: "Inspiré des codes du cyberpunk, mais conçu pour être accessible à tous les utilisateurs.",
      accent: "neo-purple"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Éléments décoratifs plus subtils */}
      <div className="absolute inset-0 bg-background1 -z-10"></div>
      <div className="absolute inset-0 cyber-grid opacity-5 -z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-synth-green/30 to-transparent"></div>
      
      {/* Effet lumineux subtil */}
      <div className="absolute top-40 right-1/4 w-64 h-64 bg-synth-green/5 rounded-full blur-3xl -z-5"></div>
      <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-cyber-pink/5 rounded-full blur-3xl -z-5"></div>

      {/* Lignes cybernétiques */}
      <div className="absolute top-20 left-0 w-1/3 h-px bg-gradient-to-r from-transparent to-techno-blue/30"></div>
      <div className="absolute top-40 right-0 w-1/3 h-px bg-gradient-to-l from-transparent to-neo-purple/30"></div>
      <div className="absolute bottom-20 right-0 w-1/3 h-px bg-gradient-to-l from-transparent to-synth-green/30"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Image décorative subtile */}
        <div className="absolute -right-20 top-0 opacity-10 hidden lg:block">
          <svg width="300" height="300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" stroke="url(#circleGradient)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="35" stroke="url(#circleGradient)" strokeWidth="0.5" />
            <path d="M50 2V98" stroke="url(#lineGradient)" strokeWidth="0.3" strokeDasharray="2 2" />
            <path d="M2 50H98" stroke="url(#lineGradient)" strokeWidth="0.3" strokeDasharray="2 2" />
            <defs>
              <linearGradient id="circleGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00D67D" stopOpacity="0.7" />
                <stop offset="1" stopColor="#FF4F9A" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8A2EFF" stopOpacity="0.7" />
                <stop offset="1" stopColor="#18A0FB" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="md:flex md:items-center md:gap-16">
          {/* Côté gauche: Texte introductif */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:w-1/2 mb-12 md:mb-0"
          >
            <div className="inline-block mb-2 px-3 py-1 bg-background2/50 border-l-2 border-synth-green rounded-r-md">
              <span className="text-sm uppercase tracking-wider text-synth-green font-medium">Notre vision</span>
            </div>
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              <span className="text-gradient">Vos passions </span>
              <span className="block mt-1 neon-glow-primary">redécouvertes</span>
            </h2>
            
            <p className="text-foreground-secondary text-lg mb-6 leading-relaxed">
              MyRixi est une application mobile communautaire conçue pour connecter 
              les utilisateurs autour d&apos;intérêts communs dans un univers visuel fascinant 
              inspiré de l&apos;esthétique cyberpunk et néon.
            </p>
            
            <p className="text-foreground-secondary mb-8">
              Notre plateforme combine technologie de pointe et design immersif pour créer des 
              espaces de partage uniques où votre créativité peut s&apos;exprimer pleinement.
            </p>
            
            <Link 
              href="#fonctionnalites"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-cyber text-foreground rounded-lg hover:brightness-110 transition-all"
            >
              Explorer les fonctionnalités
              <ChevronRight size={16} />
            </Link>
          </motion.div>

          {/* Côté droit: Fonctionnalités en grille */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative card-neon p-6 rounded-lg border border-divider hover:border-transparent group transition-all"
              >
                <div className={`absolute inset-0 bg-${feature.accent}/5 opacity-0 group-hover:opacity-100 rounded-lg -z-10 transition-opacity`}></div>
                <div className={`absolute -inset-0.5 bg-gradient-to-br from-${feature.accent}/0 to-${feature.accent}/30 rounded-lg opacity-0 group-hover:opacity-100 blur-sm -z-20 transition-opacity`}></div>
                
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center p-3 rounded-md glass border border-divider">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold mb-2 group-hover:text-${feature.accent} transition-colors`}>
                  {feature.title}
                </h3>
                
                <p className="text-foreground-secondary">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Section statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 py-10 px-8 glass border border-divider rounded-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-3xl font-bold text-synth-green mb-1">10k+</h4>
              <p className="text-foreground-secondary">Utilisateurs bêta</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-cyber-pink mb-1">100+</h4>
              <p className="text-foreground-secondary">Communautés actives</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-techno-blue mb-1">4.8/5</h4>
              <p className="text-foreground-secondary">Note moyenne</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-neo-purple mb-1">12+</h4>
              <p className="text-foreground-secondary">Mises à jour majeures</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;