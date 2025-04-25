'use client';

import React from 'react';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="py-20 bg-[#020420] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-8">See Creovai in action</h2>
          <button className="bg-[#00E6CA] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#00ccb3] transition-colors">
            Request a demo
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA; 