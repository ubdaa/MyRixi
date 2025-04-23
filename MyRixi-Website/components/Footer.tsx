'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, Users, Layout, Code } from 'lucide-react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const features = [
    {
      icon: <Layers className="w-10 h-10 text-primary" />,
      title: "App communautaire personnalisable",
      description: "Créez et rejoignez des communautés qui correspondent parfaitement à vos centres d'intérêt."
    },
    {
      icon: <Users className="w-10 h-10 text-secondary" />,
      title: "Profils riches et immersifs",
      description: "Exprimez-vous avec des profils hautement personnalisables dans un univers cybernétique unique."
    },
    {
      icon: <Layout className="w-10 h-10 text-accent" />,
      title: "Navigation fluide et visuelle",
      description: "Une interface utilisateur intuitive et futuriste pour une expérience utilisateur sans précédent."
    },
    {
      icon: <Code className="w-10 h-10 text-primary" />,
      title: "Design cybernétique accessible",
      description: "Inspiré des codes du cyberpunk, mais conçu pour être accessible à tous les utilisateurs."
    }
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
    <section id="about" className="py-20 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-4">
            <span className="text-gradient">À propos de </span>
            <span className="neon-glow-primary">MyRixi</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Une application mobile communautaire au style cybernétique conçue pour connecter 
            les utilisateurs autour d&apos;intérêts communs dans un univers visuel fascinant.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass p-8 rounded-xl hover:border-glow transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="neomorph p-4 rounded-lg">
                  {feature.icon}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;