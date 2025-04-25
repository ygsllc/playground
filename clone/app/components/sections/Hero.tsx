'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
  const customerLogos = [
    'bcu',
    'twinstar-credit-union',
    'connexus-credit-union',
    'first-bank-trust',
    'city-national-bank',
  ];

  return (
    <section className="pt-32 pb-16 bg-[#020420] text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-8">
            Contact center intelligence for the financial industry
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your business is built on trust, and your customers depend on you when making their biggest financial decisions. With Creovai, your contact center can be the driving force behind great customer relationships.
          </p>
          <button className="bg-[#00E6CA] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#00ccb3] transition-colors">
            Request a demo
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center"
        >
          {customerLogos.map((logo, index) => (
            <div key={index} className="w-32 h-16 relative grayscale hover:grayscale-0 transition-all">
              <Image
                src={`/images/logos/${logo}.svg`}
                alt={logo.replace(/-/g, ' ')}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 