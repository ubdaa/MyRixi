// app/docs/layout.tsx
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'MyRixi API Documentation',
  description: 'Documentation technique complète de l\'API MyRixi',
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow mt-16">{children}</main>
      <Footer />
    </div>
  );
}