import Hero from '@/components/Hero';
import About from '@/components/About';
import Features from '@/components/Features';
import Screenshots from '@/components/Screenshots';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <Screenshots />
      <Testimonials />
      <Faq />
    </>
  );
}