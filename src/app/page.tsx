'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StoriesDownloadSection from '@/components/StoriesDownloadSection';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function LandingPage() {
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(
          (e.currentTarget as HTMLAnchorElement).getAttribute('href')!
        );
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <div
        className="relative w-full flex flex-col items-center justify-center bg-cover bg-center py-20 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/logos/landing-page-7.png')`,
        }}
      >
        <StoriesDownloadSection />
      </div>
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </main>
  );
}
