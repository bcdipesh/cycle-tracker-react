import { useState } from 'react';
import { z } from 'zod';

import { Period } from '@/lib/types';

function readLocalStorage() {
  try {
    const item = window.localStorage.getItem('periodData');
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading localStorage', error);
    return null;
  }
}

export function useLocalStorage() {
  const [storedValue, setStoredValue] = useState<
    z.infer<typeof Period>[] | null
  >(readLocalStorage);

  const setValue = (value: z.infer<typeof Period>) => {
    try {
      setStoredValue((prevValues) => {
        const newValue = [...(prevValues ?? []), value];
        window.localStorage.setItem('periodData', JSON.stringify(newValue));
        return newValue;
      });
    } catch (error) {
      console.error('Error setting localStorage', error);
    }
  };

  return [storedValue, setValue] as const;
}
