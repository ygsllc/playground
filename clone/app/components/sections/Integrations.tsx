'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Integrations = () => {
  const integrationLogos = [
    'five9', 'salesforce', 'zendesk', 'twilio', 'genesys',
    'nice-incontact', 'freshworks', 'zoho', '8x8', 'aws',
    'dynamics365', 'mitel', 'odigo', 'glia', 'gladly'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Connect with your tech stack for a fast ROI</h2>
          <a href="/integrations" className="text-[#00E6CA] hover:text-[#00ccb3] font-semibold">
            See more integrations →
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center"
        >
          {integrationLogos.map((logo, index) => (
            <div key={index} className="w-32 h-16 relative grayscale hover:grayscale-0 transition-all">
              <Image
                src={`/images/integrations/${logo}.svg`}
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

export default Integrations; 