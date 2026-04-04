'use client';

import ReusableButton from '@/components/Reusable-Components/Reusable-Button';
import { Flex } from '@/components/Reusable-Components';
import { useRouter } from 'next/navigation';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen auth-bg">
      {/* Header with switchers */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <ThemeSwitcher />
        <LocaleSwitcher />
      </div>

      <Flex classes="min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="auth-card p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-lock text-4xl text-destructive" />
            </div>

            {/* Content */}
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access this page. Please contact your administrator if you believe this is an
              error.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <ReusableButton btnText="Go Home" onClick={() => router.push('/')} variant="primary" className="w-full sm:w-auto" />
              <ReusableButton btnText="Go Back" onClick={() => router.back()} variant="default" className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </Flex>
    </div>
  );
}
