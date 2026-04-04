'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/constants/roles';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackUrl?: string;
}

export default function RoleGuard({ children, allowedRoles, fallbackUrl = '/login' }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push(fallbackUrl);
      return;
    }

    const userRole = session.user.role as UserRole;
    if (!allowedRoles.includes(userRole)) {
      router.push('/unauthorized');
    }
  }, [session, status, allowedRoles, router, fallbackUrl]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session?.user) return null;

  const userRole = session.user.role as UserRole;
  if (!allowedRoles.includes(userRole)) return null;

  return <>{children}</>;
}

// HOC for role-based page protection
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[],
  fallbackUrl?: string
) {
  return function WrappedComponent(props: P) {
    return (
      <RoleGuard allowedRoles={allowedRoles} fallbackUrl={fallbackUrl}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}
