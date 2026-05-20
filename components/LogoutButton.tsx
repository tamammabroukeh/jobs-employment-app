'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import ReusableButton from './Reusable-Components/Reusable-Button';
import { signOutAction } from '@/apis/services/auth/actions';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Step 1: Call server action to logout from API and clear server-side cookies
      const result = await signOutAction();

      if (result?.data?.success) {
        // Step 2: Clear client-side NextAuth session
        await signOut({ redirect: false });
        
        toast.success('Logged out successfully!');
        router.push('/');
        router.refresh();
      } else if (result?.serverError) {
        toast.error(result.serverError);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server action fails, try to clear client session
      await signOut({ redirect: false });
      toast.error('Logged out locally. Please refresh the page.');
      router.push('/');
      router.refresh();
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
