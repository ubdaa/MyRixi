'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Designer & Early Adopter",
      image: "/images/testimonial-1.jpg",
      content: "MyRixi a changé ma façon de connecter avec d'autres créatifs. L'interface futuriste est non seulement belle, mais aussi incroyablement fonctionnelle !",
      stars: 5
    },
    {
      name: "Sarah Martinez",
      role: "Beta Tester",
      image: "/images/testimonial-2.jpg",
      content: "J'adore l'ambiance cyberpunk et la facilité avec laquelle je peux trouver des communautés qui partagent mes passions. Aucune autre app n'a cette esthétique !",
      stars: 5
    },
    {
      name: "Malik Johnson",
      role: "Développeur & Utilisateur",
      image: "/images/testimonial-3.jpg",
      content: "En tant que développeur, j'apprécie l'attention aux détails dans l'UI. Les animations sont fluides et l'expérience utilisateur est au top.",
      stars: 4
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
    <section id="communaute" className="py-20 bg-background relative">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-4">
            <span className="neon-glow-secondary">Communauté </span>
            <span className="text-gradient">MyRixi</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
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
              className="glass p-6 rounded-xl hover:border-glow transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className="relative w-16 h-16 mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover border-2 border-primary"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{testimonial.name}</h3>
                  <p className="text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              
              <p className="text-gray-300 italic mb-6 flex-grow">&quot;{testimonial.content}&quot;</p>
              
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                    }`}
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