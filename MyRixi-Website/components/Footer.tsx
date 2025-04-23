'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Twitter, 
  Github, 
  BotMessageSquare,
  Send, 
  ArrowRight, 
  ChevronUp,
  Mail 
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <footer className="relative bg-background1 pt-16 overflow-hidden">
      {/* Éléments décoratifs subtils */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-synth-green/40 to-transparent"></div>
      <div className="absolute top-5 left-0 w-full h-px bg-gradient-to-r from-transparent via-neo-purple/20 to-transparent"></div>
      <div className="absolute top-40 -right-40 w-80 h-80 bg-neo-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 -left-40 w-80 h-80 bg-synth-green/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4">
        {/* Logo et description en haut */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-10">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="max-w-sm"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
              <Image 
                src="/myrixi_icon.png" 
                alt="MyRixi Logo" 
                width={50} 
                height={50}
                className="object-contain rounded-md" 
              />
              <span className="text-3xl font-cyber font-bold text-gradient">MyRixi</span>
            </motion.div>
            <motion.p variants={itemVariants} className="text-foreground-secondary mb-6">
              Une application mobile communautaire au style cybernétique conçue pour connecter 
              les utilisateurs autour d&apos;intérêts communs dans un univers visuel fascinant.
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-4">
              <a 
                href="https://discord.gg/myrixi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-background2/50 p-2 rounded-lg hover:bg-discord hover:text-white transition-all"
                aria-label="Discord"
              >
                <BotMessageSquare size={20} />
              </a>
              <a 
                href="https://twitter.com/myrixi_app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-background2/50 p-2 rounded-lg hover:bg-twitter hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com/myrixi_app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-background2/50 p-2 rounded-lg hover:bg-instagram hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://github.com/ubdaa/MyRixi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-background2/50 p-2 rounded-lg hover:bg-github hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </motion.div>
          </motion.div>

          {/* Newsletter signup */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="w-full md:w-auto md:min-w-[350px]"
          >
            <motion.h3 variants={itemVariants} className="text-xl font-bold mb-4 neon-glow-primary">
              Restez connecté
            </motion.h3>
            <motion.p variants={itemVariants} className="text-foreground-secondary mb-4">
              Inscrivez-vous pour recevoir les dernières nouvelles et accéder à la bêta.
            </motion.p>
            <motion.form 
              variants={itemVariants} 
              onSubmit={handleSubmit}
              className="relative"
            >
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background2/50 border border-divider rounded-lg py-3 px-4 pr-12 focus:outline-none focus:border-synth-green transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-synth-green text-black p-2 rounded-md hover:brightness-110 transition-all"
                aria-label="S'inscrire"
              >
                {subscribed ? <ChevronUp size={18} /> : <Send size={18} />}
              </button>
            </motion.form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-synth-green text-sm mt-2"
              >
                Merci pour votre inscription !
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Liens et sitemap */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-divider"
        >
          {/* Navigation */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Accueil</span>
                </Link>
              </li>
              <li>
                <Link href="#fonctionnalites" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Fonctionnalités</span>
                </Link>
              </li>
              <li>
                <Link href="#screenshots" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Captures d&apos;écran</span>
                </Link>
              </li>
              <li>
                <Link href="#communaute" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Communauté</span>
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Ressources */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4">Ressources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/developpeurs" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Documentation API</span>
                </Link>
              </li>
              <li>
                <Link href="/statut" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Statut des services</span>
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Historique des mises à jour</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/aide" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Centre d&apos;aide</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Nous contacter</span>
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Suggérer des fonctionnalités</span>
                </Link>
              </li>
              <li>
                <Link href="/signaler" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Signaler un problème</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Légal */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4">Légal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/conditions" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Conditions d&apos;utilisation</span>
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Politique de confidentialité</span>
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Politique des cookies</span>
                </Link>
              </li>
              <li>
                <Link href="/licences" className="text-foreground-secondary hover:text-synth-green transition-colors flex items-center gap-1">
                  <ArrowRight size={14} />
                  <span>Licences</span>
                </Link>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Contact et copyright */}
        <div className="pt-8 pb-10 border-t border-divider">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-foreground-secondary">
              <Mail size={16} />
              <span>contact@myrixi.com</span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm text-foreground-secondary">
              <span>© {new Date().getFullYear()} MyRixi. Tous droits réservés.</span>
              <span>Conçu avec passion par ubdaa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-background2/80 backdrop-blur-md p-3 rounded-full border border-divider hover:border-synth-green hover:bg-background2 transition-all z-50"
        aria-label="Retour en haut"
      >
        <ChevronUp size={20} className="text-synth-green" />
      </button>
    </footer>
  );
};

export default Footer;