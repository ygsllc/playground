import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[#020420] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Social Links */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo.svg"
                alt="CreoVAI Clone"
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
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <FooterLinks
              links={[
                { href: '/platform-overview', text: 'Platform Overview' },
                { href: '/real-time-agent-assist', text: 'Real-Time Agent Assist' },
                { href: '/qa-automation', text: 'QA Automation' },
                { href: '/conversation-intelligence', text: 'Conversation Intelligence' },
              ]}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Solutions</h3>
            <FooterLinks
              links={[
                { href: '/financial-services', text: 'Financial Services' },
                { href: '/insurance', text: 'Insurance' },
                { href: '/utilities', text: 'Utilities' },
                { href: '/credit-unions', text: 'Credit Unions' },
              ]}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <FooterLinks
              links={[
                { href: '/about', text: 'About Us' },
                { href: '/customers', text: 'Customers' },
                { href: '/partners', text: 'Partners' },
                { href: '/contact', text: 'Contact' },
              ]}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <FooterLinks
              links={[
                { href: '/blog', text: 'Blog' },
                { href: '/resources', text: 'Resources' },
                { href: '/case-studies', text: 'Case Studies' },
                { href: '/privacy-policy', text: 'Privacy Policy' },
              ]}
            />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} CreoVAI Clone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }: { href: string; icon: string }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-[#00E6CA] transition-colors"
    >
      <Image src={`/images/${icon}`} alt="" width={20} height={20} />
    </a>
  );
};

const FooterLinks = ({ links }: { links: { href: string; text: string }[] }) => {
  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-gray-400 hover:text-[#00E6CA] transition-colors"
          >
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Footer; 