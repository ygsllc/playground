'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function FinancialServices() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#020420] via-[#03052e] to-[#0a0f5e] text-white pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h4 className="text-[#00E6CA] font-medium mb-4">
              CREOVAI FOR FINANCIAL INSTITUTIONS
            </h4>
            <h1 className="text-5xl font-serif mb-6">
              Contact center intelligence for the financial industry
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Your business is built on trust, and your customers depend on you when making their biggest financial decisions. With Creovai, your contact center can be the driving force behind great customer relationships. Arm your agents with real-time guidance to successfully resolve customer issues, and mine conversations for insights to improve every stage of the customer journey.
            </p>
            <Link
              href="/demo"
              className="inline-block bg-[#00E6CA] text-navy-900 px-8 py-3 rounded-md font-medium hover:bg-[#00c4ac] transition-colors"
            >
              Request a demo
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <div className="relative h-full">
            <Image
              src="/images/hero-illustration.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {['bcu', 'twinstar', 'connexus', 'firstbank', 'citynational'].map((logo) => (
              <Image
                key={logo}
                src={`/images/${logo}-logo.svg`}
                alt={`${logo} logo`}
                width={120}
                height={60}
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Sections */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FeatureSection
            title="Help agents navigate complex interactions with ease"
            description="Your agents are responsible for assisting customers with complex and emotionally charged issues while also meeting regulatory requirements. It's not an easy job, but Creovai Real-Time Guidance can reduce stress and improve first contact resolution."
            features={[
              "Guide agents through workflow steps and deliver intent-based prompts in one simple interface, ensuring successful resolutions to the most challenging issues.",
              "Keep conversations in compliance with AI-powered dynamic checklists.",
              "Reduce after-call work—and give agents more time to focus on customers—with AI-generated call summaries and wrap-up assistance."
            ]}
            image="/images/feature-1.svg"
            links={[
              { href: "/platform/real-time-agent-workflow", text: "Learn more about Agent Workflow" },
              { href: "/platform/real-time-agent-assist", text: "Learn more about Real-Time Agent Assist" }
            ]}
          />

          <FeatureSection
            title="Deliver consistent, high-quality service to every customer"
            description="It's easier than ever for customers to switch financial institutions, and the quality of your service can make or break customer loyalty. Improve your coaching and ensure your agents consistently deliver great experiences with Creovai's QA Automation."
            features={[
              "Automatically score 100% of customer interactions to identify your best coaching opportunities and reduce your manual QA time.",
              "Identify the agent behaviors with the biggest impact on the customer experience—and build these insights into your coaching.",
              "Avoid costly fines, legal fees, and reputational damage by tracking compliance criteria across every interaction."
            ]}
            image="/images/feature-2.svg"
            links={[
              { href: "/platform/qa-automation", text: "Learn more about QA Automation" }
            ]}
            reverse
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#020420] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif mb-8">See Creovai in action</h2>
          <Link
            href="/demo"
            className="inline-block bg-[#00E6CA] text-navy-900 px-8 py-3 rounded-md font-medium hover:bg-[#00c4ac] transition-colors"
          >
            Request a demo
          </Link>
        </div>
      </section>
    </Layout>
  );
}

interface FeatureSectionProps {
  title: string;
  description: string;
  features: string[];
  image: string;
  links: { href: string; text: string }[];
  reverse?: boolean;
}

const FeatureSection = ({
  title,
  description,
  features,
  image,
  links,
  reverse = false,
}: FeatureSectionProps) => {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center mb-20`}>
      <div className="flex-1">
        <h2 className="text-3xl font-serif mb-6">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-[#00E6CA] mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-[#00E6CA] hover:underline"
            >
              {link.text} →
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <Image
          src={image}
          alt=""
          width={600}
          height={400}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}; 