import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#020420] to-[#03052e] py-4">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="CreoVAI Clone"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/platform">Platform</NavLink>
            <NavLink href="/solutions">Solutions</NavLink>
            <NavLink href="/customers">Customers</NavLink>
            <NavLink href="/company">Company</NavLink>
            <NavLink href="/resources">Resources</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <Link
              href="/demo"
              className="bg-[#00E6CA] text-navy-900 px-6 py-2 rounded-md font-medium hover:bg-[#00c4ac] transition-colors"
            >
              Request a demo
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href} className="text-white hover:text-[#00E6CA] transition-colors">
      {children}
    </Link>
  );
};

export default Header; 