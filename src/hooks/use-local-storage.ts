import { useEffect, useState } from 'react';

const getLocalValue = <T>(key: string, initValue: T | (() => T)): T => {
  // SSR (e.g., Next.js) check
  if (typeof window === 'undefined')
    return initValue instanceof Function ? initValue() : initValue;

  try {
    const localValue = localStorage.getItem(key);
    if (localValue !== null) {
      return JSON.parse(localValue) as T;
    }
  } catch (error) {
    console.error('Error parsing localStorage value:', error);
  }

  return initValue instanceof Function ? initValue() : initValue;
};

export const useLocalStorage = <T>(key: string, initValue: T | (() => T)) => {
  const [value, setValue] = useState<T>(() => getLocalValue<T>(key, initValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage value:', error);
    }
  }, [key, value]);

  return [value, setValue] as const;
};
