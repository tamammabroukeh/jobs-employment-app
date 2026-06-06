# useRefreshToken Hook

A React hook for manually refreshing the access token in your Next.js application.

## Important Note

**Token refresh happens automatically on 401 errors.** You typically don't need to manually refresh tokens. This hook is provided for special scenarios where you need explicit control over token refresh timing.

## When to Use

Use this hook only in these specific scenarios:

1. **Proactive Refresh** - Refresh token before it expires (e.g., before a long-running operation)
2. **User-Triggered Refresh** - Allow users to manually refresh their session
3. **Debugging** - Test token refresh functionality during development
4. **Special UI Requirements** - Display token status or refresh controls

## When NOT to Use

- ❌ Before every API call (automatic refresh handles this)
- ❌ On component mount (unnecessary overhead)
- ❌ In response to 401 errors (already handled automatically)
- ❌ As a workaround for authentication issues

## Installation

The hook is already available in your project:

```typescript
import { useRefreshToken } from '@/hooks/auth/useRefreshToken';
```

## Basic Usage

```typescript
'use client';

import { useRefreshToken } from '@/hooks/auth/useRefreshToken';

export function MyComponent() {
  const { refreshToken, isRefreshing } = useRefreshToken();

  return (
    <button onClick={refreshToken} disabled={isRefreshing}>
      {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
    </button>
  );
}
```

## API Reference

### Return Values

```typescript
{
  refreshToken: () => void;           // Function to trigger token refresh
  isRefreshing: boolean;              // True while refresh is in progress
  result: ActionResult | undefined;   // Result from the server action
  status: 'idle' | 'executing' | 'hasSucceeded' | 'hasErrored';
  error: ServerError | ValidationErrors | undefined;
}
```

### `refreshToken()`

Triggers a manual token refresh.

- Calls the `/api/auth/refresh` endpoint
- Updates the NextAuth session with new token
- Returns immediately (async operation)

### `isRefreshing`

Boolean indicating if a refresh is currently in progress.

```typescript
if (isRefreshing) {
  console.log('Token refresh in progress...');
}
```

### `result`

Contains the result from the server action after refresh completes.

```typescript
if (result?.data) {
  console.log('New token:', result.data.accessToken);
  console.log('Expires in:', result.data.expiresIn, 'seconds');
}
```

### `status`

Current status of the refresh operation:
- `'idle'` - No refresh in progress
- `'executing'` - Refresh in progress
- `'hasSucceeded'` - Refresh completed successfully
- `'hasErrored'` - Refresh failed

### `error`

Error information if refresh fails.

```typescript
if (error) {
  console.error('Refresh failed:', error);
}
```

## Examples

### 1. Simple Refresh Button

```typescript
export function RefreshButton() {
  const { refreshToken, isRefreshing } = useRefreshToken();

  return (
    <button onClick={refreshToken} disabled={isRefreshing}>
      {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
    </button>
  );
}
```

### 2. With Success/Error Messages

```typescript
export function RefreshWithFeedback() {
  const { refreshToken, isRefreshing, result, error } = useRefreshToken();

  return (
    <div>
      <button onClick={refreshToken} disabled={isRefreshing}>
        Refresh Token
      </button>

      {result?.data && (
        <p className="text-green-600">
          ✓ Token refreshed! Expires in {result.data.expiresIn}s
        </p>
      )}

      {error && (
        <p className="text-red-600">
          ✗ Failed to refresh token
        </p>
      )}
    </div>
  );
}
```

### 3. Refresh Before Sensitive Action

```typescript
export function SensitiveActionButton() {
  const { refreshToken, isRefreshing } = useRefreshToken();

  const handleAction = async () => {
    // Refresh token first
    await refreshToken();
    
    // Then perform sensitive action
    await performSensitiveAction();
  };

  return (
    <button onClick={handleAction} disabled={isRefreshing}>
      {isRefreshing ? 'Refreshing...' : 'Perform Action'}
    </button>
  );
}
```

### 4. Display Token Status

```typescript
export function TokenStatus() {
  const { data: session } = useSession();
  const { refreshToken, isRefreshing } = useRefreshToken();

  return (
    <div className="p-4 border rounded">
      <h3>Session Status</h3>
      <p>User: {session?.user?.name}</p>
      <p>Has Token: {session?.accessToken ? 'Yes' : 'No'}</p>
      
      <button onClick={refreshToken} disabled={isRefreshing}>
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
}
```

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                  Manual Refresh Flow                         │
└─────────────────────────────────────────────────────────────┘

1. User clicks refresh button
   ↓
2. Hook calls refreshTokenAction (server action)
   ↓
3. Server action calls authRepository.refreshToken()
   ↓
4. authFetcher adds Authorization header
   ↓
5. POST /api/auth/refresh with current token
   ↓
6. API returns new access_token and user data
   ↓
7. Hook updates NextAuth session with new token
   ↓
8. Session is updated, new token is available
```

## Integration with NextAuth

The hook automatically updates your NextAuth session:

```typescript
// After successful refresh
await updateSession({
  accessToken: newToken,
  user: userData,
});

// Session is now updated
const { data: session } = useSession();
console.log(session.accessToken); // New token
```

## Error Handling

```typescript
const { refreshToken, error } = useRefreshToken();

const handleRefresh = async () => {
  await refreshToken();
  
  if (error) {
    // Handle error
    if (error.serverError) {
      console.error('Server error:', error.serverError);
    }
    
    // Redirect to login if refresh fails
    router.push('/auth/login');
  }
};
```

## Best Practices

### ✅ Do

```typescript
// Use for proactive refresh before long operations
const handleLongOperation = async () => {
  await refreshToken(); // Ensure fresh token
  await performLongOperation();
};

// Use for user-triggered refresh
<button onClick={refreshToken}>Refresh Session</button>

// Use for debugging
console.log('Manually refreshing token for testing...');
await refreshToken();
```

### ❌ Don't

```typescript
// Don't refresh before every API call
const fetchData = async () => {
  await refreshToken(); // Unnecessary!
  await authFetcher('/api/data'); // Already handles refresh
};

// Don't refresh on component mount
useEffect(() => {
  refreshToken(); // Unnecessary overhead!
}, []);

// Don't use as error recovery
try {
  await authFetcher('/api/data');
} catch (error) {
  if (is401Error(error)) {
    await refreshToken(); // Already done automatically!
  }
}
```

## Comparison with Automatic Refresh

| Feature | Automatic Refresh | Manual Refresh (this hook) |
|---------|------------------|---------------------------|
| Trigger | 401 error | User action |
| Use Case | Normal API calls | Special scenarios |
| Frequency | As needed | On demand |
| Overhead | None | Minimal |
| Recommended | ✅ Yes (default) | ⚠️ Rare cases only |

## Server Action

The hook uses the `refreshTokenAction` server action:

```typescript
// apis/services/auth/actions.ts
export const refreshTokenAction = actionClient.action(async () => {
  const response = await authRepository.refreshToken();
  
  return {
    success: true,
    user: response.user,
    accessToken: response.access_token,
    tokenType: response.token_type,
    expiresIn: response.expires_in,
  };
});
```

## TypeScript Support

Full TypeScript support with proper types:

```typescript
import { useRefreshToken } from '@/hooks/auth/useRefreshToken';

const {
  refreshToken,    // () => void
  isRefreshing,    // boolean
  result,          // ActionResult | undefined
  status,          // 'idle' | 'executing' | 'hasSucceeded' | 'hasErrored'
  error,           // ServerError | ValidationErrors | undefined
} = useRefreshToken();
```

## Troubleshooting

### Token refresh fails

**Symptom:** Error when calling `refreshToken()`

**Solutions:**
1. Check if user is authenticated
2. Verify refresh endpoint is working: `/api/auth/refresh`
3. Check server logs for errors
4. Ensure `BASE_URL` environment variable is set

### Session not updating

**Symptom:** New token not reflected in session

**Solutions:**
1. Ensure you're using `useSession()` from `next-auth/react`
2. Check that `updateSession()` is being called
3. Verify NextAuth configuration is correct

### Infinite refresh loop

**Symptom:** Multiple refresh calls in quick succession

**Solutions:**
1. Check `isRefreshing` flag before calling `refreshToken()`
2. Don't call `refreshToken()` in `useEffect` without dependencies
3. Avoid calling `refreshToken()` on every render

## Related

- [Token Manager Documentation](../../apis/utils/tokenManager.README.md)
- [Auth Actions](../../apis/services/auth/actions.ts)
- [NextAuth Configuration](../../lib/auth.ts)
- [Error Helpers](../../apis/utils/errorHelpers.ts)

## Summary

- ✅ Use for manual, user-triggered token refresh
- ✅ Automatically updates NextAuth session
- ✅ Full TypeScript support
- ⚠️ Not needed for normal API calls (automatic refresh handles it)
- ⚠️ Use sparingly - automatic refresh is preferred
