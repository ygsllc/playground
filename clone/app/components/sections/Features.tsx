'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const FeatureBlock = ({ title, description, image, link }: {
  title: string;
  description: string;
  image: string;
  link: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid md:grid-cols-2 gap-12 items-center py-16 border-b border-gray-100 last:border-0"
    >
      <div className="order-2 md:order-1">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <p className="text-gray-600 mb-8">{description}</p>
        <a href={link} className="text-[#00E6CA] hover:text-[#00ccb3] font-semibold">
          Learn more →
        </a>
      </div>
      <div className="order-1 md:order-2">
        <Image
          src={`/images/illustrations/${image}`}
          alt={title}
          width={500}
          height={400}
          className="w-full"
        />
      </div>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      title: "Help agents navigate complex interactions with ease",
      description: "Your agents are responsible for assisting customers with complex and emotionally charged issues while also meeting regulatory requirements. It's not an easy job, but Creovai Real-Time Guidance can reduce stress and improve first contact resolution.",
      image: "agent-workflow.svg",
      link: "/platform/agent-workflow"
    },
    {
      title: "Deliver consistent, high-quality service to every customer",
      description: "It's easier than ever for customers to switch financial institutions, and the quality of your service can make or break customer loyalty. Improve your coaching and ensure your agents consistently deliver great experiences with Creovai's QA Automation.",
      image: "qa-automation.svg",
      link: "/platform/qa-automation"
    },
    {
      title: "Grow customer loyalty and share-of-wallet",
      description: "Understanding your customers' needs is the key to strengthening loyalty and growing wallet share. Creovai Conversation Intelligence lets you listen to your customers at scale, spot trends, and make high-impact CX decisions.",
      image: "conversation-intelligence.svg",
      link: "/platform/conversation-intelligence"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {features.map((feature, index) => (
          <FeatureBlock key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features; 