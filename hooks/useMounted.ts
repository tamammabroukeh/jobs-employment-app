"use client"
import { useSyncExternalStore } from 'react';

/**
 * Hook to detect if component is mounted on the client
 * 
 * This hook is useful for preventing hydration mismatches in Next.js
 * when you have client-side only features like:
 * - localStorage/sessionStorage access
 * - Theme switching
 * - Browser-specific APIs
 * - Dynamic content that differs between server and client
 * 
 * Uses useSyncExternalStore to properly sync with the "external store" 
 * of whether we're on the client or server, avoiding React Compiler warnings.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const mounted = useMounted();
 *   
 *   if (!mounted) {
 *     return <div>Loading...</div>; // or placeholder
 *   }
 *   
 *   return <div>{localStorage.getItem('data')}</div>;
 * }
 * ```
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {}, // subscribe: no-op since this never changes after mount
    () => true,      // getSnapshot: always true on client
    () => false      // getServerSnapshot: always false on server
  );
}
