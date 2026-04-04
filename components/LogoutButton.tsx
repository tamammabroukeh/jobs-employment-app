'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ReusableButton from './Reusable-Components/Reusable-Button';
import { signOutAction } from '@/api/services/auth/actions';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const result = await signOutAction();

      if (result?.data?.success) {
        toast.success('Logged out successfully!');
        router.push('/login');
        router.refresh();
      } else if (result?.serverError) {
        toast.error(result.serverError);
      }
    } catch {
      toast.error('Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReusableButton
      btnText="Logout"
      onClick={handleLogout}
      isLoading={isLoading}
      variant="default"
      className={className}
    />
  );
}
