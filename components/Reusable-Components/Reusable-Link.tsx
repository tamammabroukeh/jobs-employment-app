'use client';

import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';

interface IReusableLink {
  href: string;
  children?: React.ReactNode;
  linkText?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'muted' | 'underline' | 'button';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  external?: boolean;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  locale?: string | false;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const VARIANT_CLASSES = {
  default: 'text-foreground hover:text-primary transition-colors',
  primary: 'text-primary hover:text-primary/80 font-medium transition-colors',
  secondary: 'text-muted-foreground hover:text-foreground transition-colors',
  muted: 'text-muted-foreground hover:text-muted-foreground/80 transition-colors',
  underline: 'text-foreground underline hover:text-primary transition-colors',
  button: 'inline-flex items-center justify-center rounded-md bg-primary text-white hover:bg-primary/90 transition-colors',
} as const;

const SIZE_CLASSES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
} as const;

const BUTTON_SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const;

export default function ReusableLink({
  href,
  children,
  linkText,
  className,
  variant = 'default',
  size = 'md',
  disabled = false,
  external = false,
  prefetch = true,
  replace = false,
  scroll = true,
  shallow = false,
  locale,
  onClick,
  target,
  rel,
  ariaLabel,
  icon,
  iconPosition = 'left',
}: IReusableLink) {
  // Determine if link is external
  const isExternal = external || href.startsWith('http') || href.startsWith('//');
  
  // Set appropriate target and rel for external links
  const linkTarget = target || (isExternal ? '_blank' : undefined);
  const linkRel = rel || (isExternal ? 'noopener noreferrer' : undefined);

  // Build className
  const variantClass = VARIANT_CLASSES[variant];
  const sizeClass = variant === 'button' ? BUTTON_SIZE_CLASSES[size] : SIZE_CLASSES[size];
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  
  const classes = cn(
    variantClass,
    sizeClass,
    disabledClass,
    variant === 'button' && 'inline-flex items-center gap-2',
    className
  );

  // Handle click
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Render content with optional icon
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
      {children || linkText}
      {icon && iconPosition === 'right' && <span className="inline-flex">{icon}</span>}
    </>
  );

  // For external links, use regular anchor tag
  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target={linkTarget}
        rel={linkRel}
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-disabled={disabled}
      >
        {content}
      </a>
    );
  }

  // For internal links, use Next.js Link
  return (
    <Link
      href={href}
      className={classes}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      locale={locale}
      onClick={handleClick}
      target={linkTarget}
      rel={linkRel}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {content}
    </Link>
  );
}
