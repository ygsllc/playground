'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Import sections (to be created)
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import Testimonials from '@/components/sections/Testimonials';
import Integrations from '@/components/sections/Integrations';
import CTA from '@/components/sections/CTA';

export default function FinancialServices() {
  return (
    <main className="min-h-screen pt-16">
      <Hero />
      <Features />
      <Testimonials />
      <Integrations />
      <CTA />
    </main>
  );
}
