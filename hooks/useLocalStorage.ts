import { useState, useEffect } from "react";

const getLocalValue = <T>(key: string, initialValue: T | (() => T)): T => {
  // SSR Next.js
  if (typeof window === "undefined") {
    return initialValue instanceof Function ? initialValue() : initialValue;
  }

  // If a value is already stored
  const item = localStorage.getItem(key);
  if (item !== null) {
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  }

  // Return result of a function
  if (initialValue instanceof Function) {
    return initialValue();
  }

  return initialValue;
};

const useLocalStorage = <T>(key: string, initialValue: T | (() => T)) => {
  const [value, setValue] = useState<T>(() => {
    return getLocalValue<T>(key, initialValue);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
};

export default useLocalStorage;
