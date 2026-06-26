'use client';

import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { refreshTokenAction } from '@/apis/services/auth/actions';
import { useSession } from 'next-auth/react';

/**
 * Hook for manually refreshing the access token
 * 
 * Note: Token refresh happens automatically on 401 errors.
 * This hook is only needed for manual refresh scenarios.
 */
export function useRefreshToken() {
  const { update: updateSession } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { execute, result, status } = useAction(refreshTokenAction, {
    onSuccess: async (data) => {
      console.log('[useRefreshToken] Token refresh successful');
      
      // Update the NextAuth session with new token
      if (data.data?.accessToken) {
        await updateSession({
          accessToken: data.data.accessToken,
          user: data.data.user,
        });
        console.log('[useRefreshToken] Session updated with new token');
      }
      
      setIsRefreshing(false);
    },
    onError: (error) => {
      console.error('[useRefreshToken] Token refresh failed:', error);
      setIsRefreshing(false);
    },
  });

  const refreshToken = async () => {
    if (isRefreshing) {
      console.log('[useRefreshToken] Refresh already in progress');
      return;
    }

    console.log('[useRefreshToken] Starting token refresh...');
    setIsRefreshing(true);
    execute();
  };

  return {
    refreshToken,
    isRefreshing: isRefreshing || status === 'executing',
    result,
    status,
    error: result?.serverError || result?.validationErrors,
  };
}
