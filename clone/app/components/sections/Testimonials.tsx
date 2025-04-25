'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="mb-8">
            <Image
              src="/images/testimonials/keith-parris.jpg"
              alt="Keith Parris"
              width={80}
              height={80}
              className="rounded-full mx-auto"
            />
          </div>
          <blockquote className="text-3xl font-light italic mb-8">
            "I want to make sure we're able to provide the most efficient, effortless engagement possible. Creovai has helped us do that."
          </blockquote>
          <div className="text-gray-600">
            <p className="font-semibold">Keith Parris</p>
            <p>VP, Contact Center Operations and Technology, BCU</p>
          </div>
          <div className="mt-12">
            <a href="/customers" className="text-[#00E6CA] hover:text-[#00ccb3] font-semibold">
              See more customer success stories →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials; 