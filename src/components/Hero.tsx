'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';

const Hero = () => {
  const { loginWithRedirect } = useAuth0();

  // const stats = [
  //   { number: '10M+', label: 'Photo Storage' },
  //   { number: '🚀', label: 'Just Launched! Be among the first to try SnapSync' },
  //   { number: '99.9%', label: 'Uptime' },
  //   { number: '24/7', label: 'Support' },
  // ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 overflow-hidden text-gray-900">
      {/* Background lights */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl"
        />
      </div> */}

      {/* Main Content Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl px-6 min-h-[70vh]">
        <motion.h1
          className="whitespace-nowrap text-3xl sm:text-5xl md:text-7xl font-extrabold text-gray-100 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Welcome to SnapSync
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-gray-200 mt-6 max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          The easiest way to organize, store, and share your photos and videos
          with friends and family. Secure, fast, and beautiful.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-6 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-white text-blue-700 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
            onClick={() =>
              loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
            }
          >
            Get Started
          </motion.button>

          <Link href="#how-it-works">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-blue-900 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-blue-800 transition border border-blue-700"
            >
              How It Works
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 w-full max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {/* {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="bg-white/95 p-6 rounded-2xl shadow-lg text-center"
            >
              <div className="text-3xl font-bold text-blue-700">{stat.number}</div>
              <div className="text-gray-700 mt-2 text-sm sm:text-base">{stat.label}</div>
            </motion.div>
          ))} */}
        </motion.div>
      </div>

      {/* Bottom waves */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <svg
          className="w-full h-24 text-white"
          viewBox="0 0 1440 100"
          fill="currentColor"
        >
          <path d="M0,32L60,37.3C120,43,240,53,360,58.7C480,64,600,64,720,58.7C840,53,960,43,1080,42.7C1200,43,1320,53,1380,58.7L1440,64V100H0Z" />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;
