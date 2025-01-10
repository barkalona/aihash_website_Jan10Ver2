import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function Link({ href, children, className = '' }: LinkProps) {
  return (
    <a 
      href={href} 
      className={`text-gray-300 hover:text-[#00FF9D] transition-colors ${className}`}
    >
      {children}
    </a>
  );
}