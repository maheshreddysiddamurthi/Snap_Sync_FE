'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth0 } from '@auth0/auth0-react';

const Hero = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 overflow-hidden text-gray-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center lg:text-left">
        {/* Flex container for text/buttons and images */}
        <div className="lg:flex lg:items-center lg:justify-between lg:space-x-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8 lg:w-1/2 lg:pr-10"
          >
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-100 leading-tight -mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to SnapSync
            </motion.h1>

            <motion.p
              className="max-w-3xl mx-auto lg:mx-0 text-xl text-gray-200 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The easiest way to organize, store, and share your photos and videos
              with friends and family. Secure, fast, and beautiful.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-4 bg-white text-blue-600 rounded-full text-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
                onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
              >
                Get Started
              </motion.button>
              <Link href="#how-it-works">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-10 py-4 bg-blue-900 text-white rounded-full text-xl font-semibold hover:bg-blue-800 transition-all duration-300 shadow-lg border border-blue-700"
                >
                  How It Works
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 mt-8 lg:mt-0 flex flex-col items-center space-y-8"
          >
            <div className="w-full max-w-md rounded-2xl shadow-lg overflow-hidden relative h-64 sm:h-80 md:h-96">
              <Image
                src="/logos/landing-page-6.png"
                alt="Hero image 1"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto lg:mx-0 pt-12 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { number: '10M+', label: 'Photo Storage' },
            { number: '🚀', label: 'Just Launched! Be among the first to try SnapSync' },
            { number: '99.9%', label: 'Uptime' },
            { number: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-bold text-blue-700 mb-3">{stat.number}</div>
              <div className="text-gray-700 text-base md:text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative wave */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <svg
          className="w-full h-24 text-white"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path
            d="M0,32L60,37.3C120,43,240,53,360,58.7C480,64,600,64,720,58.7C840,53,960,43,1080,42.7C1200,43,1320,53,1380,58.7L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
          />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero; 