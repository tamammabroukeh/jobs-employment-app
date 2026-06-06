/**
 * useRefreshToken Hook Examples
 * 
 * This file demonstrates how to use the manual token refresh hook
 * 
 * Note: Token refresh happens automatically on 401 errors.
 * These examples are for manual refresh scenarios only.
 */

'use client';

import { useRefreshToken } from './useRefreshToken';
import { useSession } from 'next-auth/react';

// ============================================================================
// Example 1: Basic Manual Refresh Button
// ============================================================================

export function RefreshTokenButton() {
  const { refreshToken, isRefreshing } = useRefreshToken();

  return (
    <button
      onClick={refreshToken}
      disabled={isRefreshing}
      className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
    >
      {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
    </button>
  );
}

// ============================================================================
// Example 2: Refresh with Status Display
// ============================================================================

export function RefreshTokenWithStatus() {
  const { refreshToken, isRefreshing, result, error } = useRefreshToken();

  return (
    <div className="space-y-4">
      <button
        onClick={refreshToken}
        disabled={isRefreshing}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
      </button>

      {result?.data && (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          ✓ Token refreshed successfully!
          <br />
          Expires in: {result.data.expiresIn} seconds
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          ✗ Failed to refresh token: {JSON.stringify(error)}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 3: Auto-Refresh Before Expiration
// ============================================================================

export function AutoRefreshComponent() {
  const { data: session } = useSession();
  const { refreshToken, isRefreshing } = useRefreshToken();

  // Check if token is expiring soon (within 5 minutes)
  const isExpiringSoon = () => {
    if (!session?.accessToken) return false;
    
    // You would need to decode the JWT to get expiration time
    // This is a simplified example
    const tokenExpires = (session as any).tokenExpires;
    if (!tokenExpires) return false;
    
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() > tokenExpires - fiveMinutes;
  };

  // Auto-refresh if expiring soon
  React.useEffect(() => {
    if (isExpiringSoon() && !isRefreshing) {
      console.log('Token expiring soon, auto-refreshing...');
      refreshToken();
    }
  }, [session, isRefreshing, refreshToken]);

  return (
    <div>
      {isExpiringSoon() && (
        <div className="p-2 bg-yellow-100 text-yellow-800 text-sm">
          Token expiring soon...
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 4: Refresh on User Action
// ============================================================================

export function ProtectedActionButton() {
  const { refreshToken, isRefreshing } = useRefreshToken();

  const handleProtectedAction = async () => {
    // Refresh token before performing sensitive action
    await refreshToken();
    
    // Then perform the action
    console.log('Performing protected action with fresh token...');
    // Your protected action here
  };

  return (
    <button
      onClick={handleProtectedAction}
      disabled={isRefreshing}
      className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
    >
      {isRefreshing ? 'Refreshing...' : 'Perform Protected Action'}
    </button>
  );
}

// ============================================================================
// Example 5: Refresh with Callback
// ============================================================================

export function RefreshWithCallback() {
  const { refreshToken, isRefreshing, result } = useRefreshToken();

  const handleRefresh = async () => {
    await refreshToken();
    
    // Check result after refresh
    if (result?.data) {
      console.log('Token refreshed, new token:', result.data.accessToken);
      // Do something after successful refresh
    }
  };

  return (
    <button onClick={handleRefresh} disabled={isRefreshing}>
      {isRefreshing ? 'Refreshing...' : 'Refresh & Continue'}
    </button>
  );
}

// ============================================================================
// Example 6: Display Token Info
// ============================================================================

export function TokenInfoDisplay() {
  const { data: session } = useSession();
  const { refreshToken, isRefreshing } = useRefreshToken();

  return (
    <div className="p-4 border rounded space-y-2">
      <h3 className="font-bold">Token Information</h3>
      
      <div className="text-sm space-y-1">
        <p>User: {session?.user?.name}</p>
        <p>Email: {session?.user?.email}</p>
        <p>Role: {session?.user?.role}</p>
        <p>Has Token: {session?.accessToken ? 'Yes' : 'No'}</p>
      </div>

      <button
        onClick={refreshToken}
        disabled={isRefreshing}
        className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded disabled:opacity-50"
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
      </button>
    </div>
  );
}

// ============================================================================
// Example 7: Refresh on Mount (if needed)
// ============================================================================

export function RefreshOnMount() {
  const { refreshToken, isRefreshing } = useRefreshToken();
  const [hasRefreshed, setHasRefreshed] = React.useState(false);

  React.useEffect(() => {
    // Refresh token once when component mounts
    if (!hasRefreshed && !isRefreshing) {
      refreshToken();
      setHasRefreshed(true);
    }
  }, [hasRefreshed, isRefreshing, refreshToken]);

  return (
    <div>
      {isRefreshing && <p>Refreshing token...</p>}
      {hasRefreshed && !isRefreshing && <p>Token refreshed!</p>}
    </div>
  );
}

// ============================================================================
// Example 8: Conditional Refresh Based on Session State
// ============================================================================

export function ConditionalRefresh() {
  const { data: session, status } = useSession();
  const { refreshToken, isRefreshing } = useRefreshToken();

  const handleAction = async () => {
    // Only refresh if user is authenticated
    if (status === 'authenticated' && session?.accessToken) {
      await refreshToken();
      console.log('Token refreshed, proceeding with action...');
    } else {
      console.log('User not authenticated, redirecting to login...');
      // Redirect to login
    }
  };

  return (
    <button onClick={handleAction} disabled={isRefreshing}>
      {isRefreshing ? 'Refreshing...' : 'Execute Action'}
    </button>
  );
}

// ============================================================================
// Example 9: Refresh with Error Handling
// ============================================================================

export function RefreshWithErrorHandling() {
  const { refreshToken, isRefreshing, error } = useRefreshToken();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleRefresh = async () => {
    setErrorMessage(null);
    
    try {
      await refreshToken();
      console.log('Token refreshed successfully');
    } catch (err) {
      setErrorMessage('Failed to refresh token. Please login again.');
      console.error('Refresh error:', err);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
      </button>

      {errorMessage && (
        <div className="p-3 bg-red-100 text-red-800 rounded">
          {errorMessage}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded text-sm">
          Error details: {JSON.stringify(error)}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 10: Integration with Form Submission
// ============================================================================

export function FormWithTokenRefresh() {
  const { refreshToken, isRefreshing } = useRefreshToken();
  const [formData, setFormData] = React.useState({ name: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Refresh token before submitting sensitive data
    await refreshToken();
    
    // Submit form with fresh token
    console.log('Submitting form with fresh token:', formData);
    // Your form submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        className="w-full px-3 py-2 border rounded"
      />
      
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        className="w-full px-3 py-2 border rounded"
      />
      
      <button
        type="submit"
        disabled={isRefreshing}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {isRefreshing ? 'Refreshing Token...' : 'Submit'}
      </button>
    </form>
  );
}

// Note: Import React for useEffect and useState
import React from 'react';
