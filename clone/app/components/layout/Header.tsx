'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DropdownProps {
  title: string;
  items: {
    section?: string;
    links: { href: string; text: string; description?: string }[];
  }[];
}

const Dropdown = ({ title, items }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
        <span>{title}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-4 z-50">
          {items.map((section, idx) => (
            <div key={idx} className="px-4">
              {section.section && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  {section.section}
                </h3>
              )}
              <div className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <Link
                    key={linkIdx}
                    href={link.href}
                    className="block text-gray-600 hover:text-[#00E6CA] transition-colors"
                  >
                    <div className="font-medium">{link.text}</div>
                    {link.description && (
                      <div className="text-sm text-gray-500">{link.description}</div>
                    )}
                  </Link>
                ))}
              </div>
              {idx < items.length - 1 && <div className="my-4 border-t border-gray-100" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const platformItems = [
    {
      section: 'Core Features',
      links: [
        { href: '/platform-overview', text: 'Platform Overview', description: 'Discover the combined power of Creovai' },
        { href: '/real-time-agent-assist', text: 'Real-Time Agent Assist', description: 'AI assistance for better interactions' },
        { href: '/qa-automation', text: 'QA Automation', description: 'Automated scoring with your QA criteria' },
        { href: '/conversation-intelligence', text: 'Conversation Intelligence', description: 'Insights to improve performance' },
      ],
    },
  ];

  const solutionsItems = [
    {
      section: 'Use Cases',
      links: [
        { href: '/contact-center-ops', text: 'Contact Center Ops', description: 'Drive efficiency and productivity' },
        { href: '/quality-assurance', text: 'Quality Assurance', description: 'Auto-scoring for 100% of interactions' },
        { href: '/sales', text: 'Sales', description: 'Improve conversion and order value' },
      ],
    },
    {
      section: 'Industries',
      links: [
        { href: '/financial-services', text: 'Financial Services', description: 'Deliver consistent customer service' },
        { href: '/insurance', text: 'Insurance', description: 'Manage the complexity of your interactions' },
        { href: '/utilities', text: 'Utilities', description: 'Resolve customer issues with confidence' },
      ],
    },
  ];

  const companyItems = [
    {
      links: [
        { href: '/about', text: 'About us', description: 'Who we are as a company' },
        { href: '/partners', text: 'Partners', description: 'The industry leaders we work with' },
      ],
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link href="/" className="text-xl font-bold text-gray-800">
              <Image src="/images/logos/creovai-logo.svg" alt="Creovai" width={120} height={32} />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Dropdown title="Platform" items={platformItems} />
              <Dropdown title="Solutions" items={solutionsItems} />
              <Link href="/customers" className="text-gray-600 hover:text-gray-800">
                Customers
              </Link>
              <Dropdown title="Company" items={companyItems} />
              <Link href="/resources" className="text-gray-600 hover:text-gray-800">
                Resources
              </Link>
            </div>
          </div>
          <button className="bg-[#00E6CA] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#00ccb3] transition-colors">
            Request a demo
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header; 