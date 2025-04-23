'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const faqItems: FaqItem[] = [
    {
      question: "Quand sort l'application ?",
      answer: "La version bêta de MyRixi est prévue pour fin 2025, avec une sortie officielle au premier trimestre 2026. Vous pouvez vous inscrire dès maintenant pour accéder à la version bêta !"
    },
    {
      question: "Comment rejoindre la bêta ?",
      answer: "Pour rejoindre le programme bêta, inscrivez-vous avec votre email via le formulaire sur notre site. Les invitations seront envoyées par vagues, et les premiers inscrits seront prioritaires."
    },
    {
      question: "Sur quels appareils est-elle disponible ?",
      answer: "MyRixi est développée pour iOS et Android. Notre objectif est de fournir une expérience parfaite sur les deux plateformes, avec des fonctionnalités identiques et synchronisées."
    },
    {
      question: "Est-ce gratuit ?",
      answer: "Oui ! MyRixi est entièrement gratuite à télécharger et à utiliser. Nous proposerons ultérieurement des fonctionnalités premium optionnelles, mais toutes les fonctionnalités de base resteront gratuites."
    },
    {
      question: "Comment mes données sont-elles protégées ?",
      answer: "La confidentialité est notre priorité. Toutes les données sont chiffrées, et nous ne partageons jamais vos informations avec des tiers. Vous pouvez consulter notre politique de confidentialité complète sur notre site."
    }
  ];

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-black relative">
      {/* Background decorations */}
      <div className="absolute -top-40 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-4">
            <span className="text-gradient">Questions </span>
            <span className="neon-glow-primary">fréquentes</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur MyRixi.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <button
                onClick={() => toggleItem(index)}
                className={`w-full text-left p-5 rounded-t-lg flex justify-between items-center ${
                  activeIndex === index ? 'bg-primary/20 border-l-2 border-primary' : 'glass hover:bg-white/5'
                } transition-all duration-300`}
              >
                <h3 className="text-xl font-bold">{item.question}</h3>
                <ChevronDown className={`w-6 h-6 transition-transform ${activeIndex === index ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 bg-white/5 rounded-b-lg border-l-2 border-primary">
                      <p className="text-gray-300">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;