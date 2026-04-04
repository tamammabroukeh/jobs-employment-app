# useMounted Hook

## Why We Need This Hook

### The Problem: Hydration Mismatches

In Next.js, components are rendered twice:
1. **Server-Side (SSR)** - Generates initial HTML
2. **Client-Side (Hydration)** - React takes over and makes it interactive

When the server HTML doesn't match the client HTML, you get a **hydration error**.

### Common Causes

```tsx
// ❌ BAD - Causes hydration error
function BadComponent() {
  const theme = localStorage.getItem('theme'); // localStorage doesn't exist on server!
  return <div>{theme}</div>;
}

// ❌ BAD - Different values on server vs client
function BadComponent() {
  const [count, setCount] = useState(Math.random()); // Different random number each render
  return <div>{count}</div>;
}

// ❌ BAD - Date changes between renders
function BadComponent() {
  return <div>{new Date().toISOString()}</div>;
}
```

### The Solution: useMounted Hook

```tsx
// ✅ GOOD - No hydration error
function GoodComponent() {
  const mounted = useMounted();
  
  if (!mounted) {
    return <div>Loading...</div>; // Same on server and first client render
  }
  
  const theme = localStorage.getItem('theme'); // Only runs on client
  return <div>{theme}</div>;
}
```

## Why Extract It as a Hook?

### 1. **Reusability**
Instead of writing the same `useState` + `useEffect` pattern in every component:

```tsx
// ❌ Repetitive - Copy-paste in every component
function Component1() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // ...
}

function Component2() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // ...
}

// ✅ Clean - One line
function Component1() {
  const mounted = useMounted();
  // ...
}

function Component2() {
  const mounted = useMounted();
  // ...
}
```

### 2. **Consistency**
Everyone uses the same implementation, reducing bugs.

### 3. **Maintainability**
If we need to change the logic, we update one file instead of many components.

### 4. **Testability**
Easier to mock and test a single hook.

### 5. **Readability**
`const mounted = useMounted()` is self-documenting - immediately clear what it does.

## Usage Examples

### Example 1: Theme Switcher
```tsx
function ThemeSwitcher() {
  const mounted = useMounted();
  const theme = useTheme();
  
  if (!mounted) {
    return <div className="w-[44px] h-[22px]" />; // Placeholder
  }
  
  return <Switch checked={theme === 'dark'} />;
}
```

### Example 2: LocalStorage Data
```tsx
function UserPreferences() {
  const mounted = useMounted();
  
  if (!mounted) {
    return <Skeleton />; // Loading state
  }
  
  const preferences = JSON.parse(localStorage.getItem('preferences') || '{}');
  return <div>{preferences.language}</div>;
}
```

### Example 3: Browser-Specific Features
```tsx
function GeolocationComponent() {
  const mounted = useMounted();
  
  if (!mounted) {
    return null; // Don't render on server
  }
  
  // navigator only exists in browser
  const hasGeolocation = 'geolocation' in navigator;
  return <div>{hasGeolocation ? 'Available' : 'Not available'}</div>;
}
```

### Example 4: Locale Switcher
```tsx
function LocaleSwitcher() {
  const mounted = useMounted();
  const locale = useLocale();
  
  if (!mounted) {
    return <div className="w-20 h-10" />; // Placeholder
  }
  
  // Cookie-based locale might differ between server and client
  return <Select value={locale} onChange={changeLocale} />;
}
```

## Best Practices

### 1. Return a Placeholder
```tsx
// ✅ GOOD - Maintains layout
if (!mounted) {
  return <div className="w-[44px] h-[22px]" />;
}

// ❌ BAD - Layout shift when component appears
if (!mounted) {
  return null;
}
```

### 2. Use for Client-Only Features
```tsx
// ✅ GOOD - Only for client-side features
const mounted = useMounted();
if (!mounted) return <Placeholder />;
const data = localStorage.getItem('key');

// ❌ BAD - Don't use for data that should be server-rendered
const mounted = useMounted();
if (!mounted) return <Placeholder />;
const data = await fetch('/api/data'); // This should be server-rendered!
```

### 3. Keep Placeholders Simple
```tsx
// ✅ GOOD - Simple, fast placeholder
if (!mounted) {
  return <div className="w-10 h-10 bg-gray-200 rounded" />;
}

// ❌ BAD - Complex placeholder defeats the purpose
if (!mounted) {
  return <ComplexSkeletonWithAnimations />;
}
```

## When NOT to Use

### Don't use for:
1. **Server-side data** - Use Next.js data fetching instead
2. **SEO-critical content** - Should be server-rendered
3. **Static content** - No need if content is the same on server and client
4. **Performance-critical paths** - Adds extra render cycle

### Use Next.js features instead:
```tsx
// ✅ GOOD - Server-side data fetching
async function Page() {
  const data = await fetch('/api/data');
  return <div>{data}</div>;
}

// ❌ BAD - Client-side only
function Page() {
  const mounted = useMounted();
  const [data, setData] = useState(null);
  
  useEffect(() => {
    if (mounted) {
      fetch('/api/data').then(setData);
    }
  }, [mounted]);
  
  return <div>{data}</div>;
}
```

## Summary

The `useMounted` hook is a **simple but powerful pattern** for handling client-side only features in Next.js. It:

- ✅ Prevents hydration errors
- ✅ Keeps code DRY (Don't Repeat Yourself)
- ✅ Makes intent clear
- ✅ Easy to maintain and test

Use it whenever you need to access browser-only APIs or client-side state that differs from the server.
