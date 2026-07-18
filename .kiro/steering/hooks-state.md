# Hooks & State Management

## Custom Hooks Location

All custom hooks are located in `/hooks/` directory.

## Translation Hooks

### useProfileTranslations

**Location:** `hooks/use-profile.ts`

```typescript
import { useTranslations } from 'next-intl';

export const useProfileTranslations = () => {
  return useTranslations('profile');
};
```

**Usage:**
```tsx
const t = useProfileTranslations();
return <div>{t('userInfo.title')}</div>;
```

### Create Custom Translation Hooks

For frequently used namespaces:

```typescript
// hooks/use-jobs.ts
import { useTranslations } from 'next-intl';

export const useJobsTranslations = () => {
  return useTranslations('jobs');
};

export const useJobDetailTranslations = () => {
  return useTranslations('jobDetail');
};
```

## React State Hooks

### useState Pattern

```tsx
// Simple state
const [isOpen, setIsOpen] = useState(false);
const [count, setCount] = useState(0);
const [name, setName] = useState('');

// Object state
const [user, setUser] = useState<User | null>(null);

// Array state
const [items, setItems] = useState<Item[]>([]);

// Update object state
setUser(prev => ({ ...prev, name: 'John' }));

// Update array state
setItems(prev => [...prev, newItem]);
setItems(prev => prev.filter(item => item.id !== id));
```

### useEffect Pattern

```tsx
// Run once on mount
useEffect(() => {
  fetchData();
}, []);

// Run when dependency changes
useEffect(() => {
  if (userId) {
    fetchUserData(userId);
  }
}, [userId]);

// Cleanup
useEffect(() => {
  const subscription = subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### useRef Pattern

```tsx
// DOM reference
const inputRef = useRef<HTMLInputElement>(null);

const focusInput = () => {
  inputRef.current?.focus();
};

<input ref={inputRef} />

// File input reference
const fileInputRef = useRef<HTMLInputElement>(null);

<input
  ref={fileInputRef}
  type="file"
  className="hidden"
/>
<ReusableButton
  onClick={() => fileInputRef.current?.click()}
  btnText="Upload"
/>
```

### useCallback Pattern

```tsx
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]); // Only recreate if value changes

<ChildComponent onClick={handleClick} />
```

### useMemo Pattern

```tsx
const filteredItems = useMemo(() => {
  return items.filter(item => item.active);
}, [items]);

const expensiveCalculation = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

## Component State Patterns

### Loading State

```tsx
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const result = await getData();
    setData(result);
  } finally {
    setIsLoading(false);
  }
};

{isLoading ? <Spin /> : <Content data={data} />}
```

### Error State

```tsx
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setError(null);
  try {
    const result = await getData();
    setData(result);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  }
};

{error && (
  <Typography variant="text" className="text-red-500">
    {error}
  </Typography>
)}
```

### Form State

```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  age: 0,
});

const handleChange = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

<Input
  value={formData.name}
  onChange={(e) => handleChange('name', e.target.value)}
/>
```

### Dialog/Modal State

```tsx
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);

const handleEdit = (item: Item) => {
  setSelectedItem(item);
  setIsDialogOpen(true);
};

const handleClose = () => {
  setIsDialogOpen(false);
  setSelectedItem(null);
};

<ReusableDialog
  isOpen={isDialogOpen}
  setIsOpen={setIsDialogOpen}
  dialogBody={
    selectedItem && <EditForm item={selectedItem} />
  }
/>
```

### List Management State

```tsx
const [items, setItems] = useState<Item[]>([]);

// Add item
const addItem = (item: Item) => {
  setItems(prev => [...prev, item]);
};

// Update item
const updateItem = (id: string, updates: Partial<Item>) => {
  setItems(prev =>
    prev.map(item => item.id === id ? { ...item, ...updates } : item)
  );
};

// Remove item
const removeItem = (id: string) => {
  setItems(prev => prev.filter(item => item.id !== id));
};

// Replace all items
const setItemsList = (newItems: Item[]) => {
  setItems(newItems);
};
```

## Custom Hook Patterns

### Data Fetching Hook

```tsx
// hooks/use-fetch-data.ts
import { useState, useEffect } from 'react';

export const useFetchData = <T,>(fetchFn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFn]);

  return { data, isLoading, error };
};

// Usage
const { data, isLoading, error } = useFetchData(() => getProfile());
```

### Form Hook

```tsx
// hooks/use-form-state.ts
import { useState } from 'react';

export const useFormState = <T extends Record<string, any>>(
  initialValues: T
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const setError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, setValue, setError, reset };
};
```

### Toggle Hook

```tsx
// hooks/use-toggle.ts
import { useState, useCallback } from 'react';

export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, toggle, setTrue, setFalse, setValue };
};

// Usage
const { value: isOpen, toggle, setTrue, setFalse } = useToggle();
```

### Debounce Hook

```tsx
// hooks/use-debounce.ts
import { useState, useEffect } from 'react';

export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    searchItems(debouncedSearch);
  }
}, [debouncedSearch]);
```

### Local Storage Hook

```tsx
// hooks/use-local-storage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

// Usage
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
```

### Previous Value Hook

```tsx
// hooks/use-previous.ts
import { useRef, useEffect } from 'react';

export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// Usage
const previousCount = usePrevious(count);
```

## State Management Best Practices

### 1. Keep State Local

Start with local state, lift up only when needed:

```tsx
// ❌ Bad - unnecessary global state
const GlobalCounter = () => {
  const [count] = useGlobalCount();
  return <div>{count}</div>;
};

// ✅ Good - local state
const LocalCounter = () => {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
};
```

### 2. Avoid Redundant State

```tsx
// ❌ Bad - redundant state
const [users, setUsers] = useState([]);
const [userCount, setUserCount] = useState(0);

// ✅ Good - derive from existing state
const [users, setUsers] = useState([]);
const userCount = users.length;
```

### 3. Group Related State

```tsx
// ❌ Bad - scattered state
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [age, setAge] = useState(0);

// ✅ Good - grouped state
const [user, setUser] = useState({
  name: '',
  email: '',
  age: 0,
});
```

### 4. Use Functional Updates

```tsx
// ❌ Bad - may cause stale closure issues
const increment = () => {
  setCount(count + 1);
};

// ✅ Good - always uses latest value
const increment = () => {
  setCount(prev => prev + 1);
};
```

### 5. Extract Reusable Logic

```tsx
// ❌ Bad - repeated logic
const ComponentA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  // ...
};

const ComponentB = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => setIsVisible(!isVisible);
  // ...
};

// ✅ Good - reusable hook
const { value: isOpen, toggle } = useToggle();
```

### 6. Cleanup Side Effects

```tsx
useEffect(() => {
  const subscription = api.subscribe();
  const timeout = setTimeout(() => {}, 1000);
  
  return () => {
    subscription.unsubscribe();
    clearTimeout(timeout);
  };
}, []);
```

### 7. Memoize Expensive Calculations

```tsx
// ✅ Good - memoized calculation
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

## Common Patterns

### Async State Updates

```tsx
const [data, setData] = useState<Data | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const loadData = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const result = await fetchData();
    setData(result);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error');
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  loadData();
}, []);
```

### Conditional Rendering Based on State

```tsx
{isLoading && <Spin />}
{error && <ErrorMessage message={error} />}
{data && <DataDisplay data={data} />}
{!isLoading && !error && !data && <EmptyState />}
```

### Multi-Step State

```tsx
const [step, setStep] = useState(1);

const nextStep = () => setStep(prev => prev + 1);
const prevStep = () => setStep(prev => prev - 1);
const goToStep = (stepNumber: number) => setStep(stepNumber);

{step === 1 && <Step1 onNext={nextStep} />}
{step === 2 && <Step2 onNext={nextStep} onPrev={prevStep} />}
{step === 3 && <Step3 onPrev={prevStep} />}
```

## Testing Hooks

### Test Custom Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useToggle } from './use-toggle';

test('useToggle toggles value', () => {
  const { result } = renderHook(() => useToggle(false));
  
  expect(result.current.value).toBe(false);
  
  act(() => {
    result.current.toggle();
  });
  
  expect(result.current.value).toBe(true);
});
```
