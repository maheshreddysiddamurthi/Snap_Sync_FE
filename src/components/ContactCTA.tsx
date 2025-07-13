'use client';

import { motion } from 'framer-motion';

// You'll need to add actual icons for app stores (e.g., Apple App Store, Google Play Store)
// and potentially contact icons (email, phone).

const ContactCTA = () => {
  return (
    <section className="py-32 md:py-48 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden flex items-center justify-center min-h-[60vh]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.3, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.3, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:flex lg:items-center lg:justify-center gap-8">
          <div className="lg:text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="mt-6 text-4xl md:text-5xl text-blue-600 font-bold max-w-3xl lg:mx-auto leading-relaxed drop-shadow-lg"
            >
              Reach out to us anytime
            </motion.p>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="bg-white bg-opacity-95 rounded-3xl shadow-2xl p-16 md:p-24 w-full h-full flex flex-col justify-center"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h3>
            <div className="space-y-8">
              <div className="flex items-start">
                {/* Email Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-8 w-8 text-blue-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 9h18a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="ml-4">
                  <p className="text-xl font-semibold text-gray-900">Send an Email</p>
                  <p className="text-lg text-gray-700">hello@snapsync.com</p>
                </div>
              </div>
              <div className="flex items-start">
                {/* Phone Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-8 w-8 text-blue-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 7a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2V7z" />
                </svg>
                <div>
                  <p className="text-xl font-semibold text-gray-900">Give Us a Call</p>
                  <p className="text-lg text-gray-700">+1 (555) 987-6543</p>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Camera Icon Box */}
          <div className="flex items-center justify-center bg-white bg-opacity-95 rounded-3xl shadow-2xl p-16 md:p-24 w-full h-full">
            <img src="/camera-icon.png" alt="Camera Icon" className="object-contain w-full h-full max-h-96 max-w-96" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA; 