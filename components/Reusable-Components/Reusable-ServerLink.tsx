import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ServerLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  external?: boolean;
}

export default function ServerLink({ href, children, className, ariaLabel, external = false }: ServerLinkProps) {
  const isExternal = external || href.startsWith('http') || href.startsWith('//');

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(
          'text-muted-foreground hover:text-primary transition-colors text-sm',
          className
        )}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'text-muted-foreground hover:text-primary transition-colors text-sm',
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
