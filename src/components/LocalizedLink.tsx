'use client';

import React from 'react';
import NextLink, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavPath } from '../lib/navigation';

export interface LocalizedLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  href: string;
  children: React.ReactNode;
}

export const LocalizedLink = React.forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  ({ href, ...props }, ref) => {
    const pathname = usePathname() || '/';
    // Use getNavPath to safely localize the href based on current pathname
    const localizedHref = getNavPath(href, pathname);
    
    return <NextLink href={localizedHref} ref={ref} {...props} />;
  }
);

LocalizedLink.displayName = 'LocalizedLink';
