'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FooterColumnProps {
  title: string;
  links: { href: string; text: string }[];
}

const FooterColumn = ({ title, links }: FooterColumnProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className="text-gray-400 hover:text-[#00E6CA] transition-colors"
          >
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialLink = ({ href, icon }: { href: string; icon: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-[#00E6CA] transition-colors"
  >
    <Image src={`/images/social/${icon}`} alt="" width={20} height={20} />
  </a>
);

const Footer = () => {
  const platformLinks = [
    { href: '/platform-overview', text: 'Platform Overview' },
    { href: '/real-time-agent-assist', text: 'Real-Time Agent Assist' },
    { href: '/qa-automation', text: 'QA Automation' },
    { href: '/conversation-intelligence', text: 'Conversation Intelligence' },
  ];

  const solutionsLinks = [
    { href: '/contact-center-ops', text: 'Contact Center Ops' },
    { href: '/quality-assurance', text: 'Quality Assurance' },
    { href: '/sales', text: 'Sales' },
    { href: '/financial-services', text: 'Financial Services' },
  ];

  const companyLinks = [
    { href: '/about', text: 'About Us' },
    { href: '/customers', text: 'Customers' },
    { href: '/partners', text: 'Partners' },
    { href: '/contact', text: 'Contact' },
  ];

  const resourcesLinks = [
    { href: '/blog', text: 'Blog' },
    { href: '/resources', text: 'Resources' },
    { href: '/case-studies', text: 'Case Studies' },
    { href: '/privacy-policy', text: 'Privacy Policy' },
  ];

  return (
    <footer className="bg-[#020420] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Social Links */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logos/creovai-logo-white.svg"
                alt="Creovai"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <div className="flex space-x-4">
              <SocialLink href="https://facebook.com" icon="facebook.svg" />
              <SocialLink href="https://twitter.com" icon="twitter.svg" />
              <SocialLink href="https://linkedin.com" icon="linkedin.svg" />
              <SocialLink href="https://instagram.com" icon="instagram.svg" />
            </div>
          </div>

          {/* Navigation Links */}
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Solutions" links={solutionsLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Resources" links={resourcesLinks} />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Creovai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 