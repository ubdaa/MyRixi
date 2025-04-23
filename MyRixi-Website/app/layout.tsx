import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyRixi - L\'app qui connecte les passions',
  description: 'MyRixi, une application mobile communautaire au style cybernétique conçue pour connecter les utilisateurs autour d\'intérêts communs.',
  openGraph: {
    title: 'MyRixi - L\'app qui connecte les passions',
    description: 'MyRixi, une application mobile communautaire au style cybernétique conçue pour connecter les utilisateurs autour d\'intérêts communs.',
    images: ['/images/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}