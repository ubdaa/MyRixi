'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Designer & Early Adopter",
      image: "/images/testimonial-1.jpg",
      content: "MyRixi a changé ma façon de connecter avec d'autres créatifs. L'interface futuriste est non seulement belle, mais aussi incroyablement fonctionnelle !",
      stars: 5,
      color: "#00D67D" // synth-green
    },
    {
      name: "Sarah Martinez",
      role: "Beta Tester",
      image: "/images/testimonial-2.jpg",
      content: "J'adore l'ambiance cyberpunk et la facilité avec laquelle je peux trouver des communautés qui partagent mes passions. Aucune autre app n'a cette esthétique !",
      stars: 5,
      color: "#FF4F9A" // cyber-pink
    },
    {
      name: "Malik Johnson",
      role: "Développeur & Utilisateur",
      image: "/images/testimonial-3.jpg",
      content: "En tant que développeur, j'apprécie l'attention aux détails dans l'UI. Les animations sont fluides et l'expérience utilisateur est au top.",
      stars: 4,
      color: "#8A2EFF" // neo-purple
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="communaute" className="py-20 bg-background1 bg-cyber-shapes-2 relative">
      {/* Lignes cybernétiques */}
      <div className="absolute top-0 left-0 h-px w-2/3 bg-gradient-to-r from-neo-purple/20 to-transparent"></div>
      <div className="absolute top-0 right-0 h-40 w-px bg-gradient-to-b from-synth-green/20 to-transparent"></div>
      <div className="absolute bottom-0 right-0 h-px w-2/3 bg-gradient-to-l from-cyber-pink/20 to-transparent"></div>
      <div className="absolute bottom-0 left-10 h-40 w-px bg-gradient-to-t from-techno-blue/20 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background2/50 rounded-full mb-4">
            <MessageSquare size={16} className="text-cyber-pink" />
            <span className="text-sm font-medium text-foreground">Témoignages utilisateurs</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="neon-glow-secondary">Communauté </span>
            <span className="text-gradient">MyRixi</span>
          </h2>
          
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            Découvrez ce que disent nos premiers utilisateurs de l&apos;expérience MyRixi.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass p-6 rounded-xl transition-all duration-500 flex flex-col hover:scale-[1.02]"
              style={{
                borderTop: `1px solid ${testimonial.color}33`,
                boxShadow: `0 10px 30px ${testimonial.color}15`
              }}
              whileHover={{
                boxShadow: `0 15px 30px ${testimonial.color}25`,
                borderTop: `1px solid ${testimonial.color}60`
              }}
            >
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 mr-4">
                  <div className="absolute -inset-1 rounded-full opacity-30" 
                    style={{ background: `radial-gradient(circle, ${testimonial.color}, transparent 70%)` }}></div>
                  
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover border-2"
                    style={{ borderColor: testimonial.color }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: testimonial.color }}>{testimonial.name}</h3>
                  <p className="text-foreground-secondary">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute top-0 left-0 w-8 h-8 -ml-2 -mt-2 opacity-10 text-cyber-pink">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                </div>
                
                <p className="text-foreground-secondary italic mb-6 pl-4 flex-grow">{testimonial.content}</p>
                
                <div className="absolute bottom-0 right-0 w-8 h-8 -mr-2 opacity-10 rotate-180 text-cyber-pink">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex mt-auto pt-4 border-t border-divider">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.stars ? 'fill-current' : 'text-gray-600'
                    }`}
                    style={i < testimonial.stars ? { color: testimonial.color } : {}}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;