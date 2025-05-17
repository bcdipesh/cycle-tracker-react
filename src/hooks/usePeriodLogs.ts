import { useState } from 'react';
import { z } from 'zod';

import { Period } from '@/lib/types';

function getStoredPeriodLogs() {
  try {
    const item = window.localStorage.getItem('periodLogs');
    return item ? JSON.parse(item) : null;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error reading localStorage';
    throw new Error(message);
  }
}

export function usePeriodLogs() {
  const [periodLogs, setPeriodLogs] = useState<z.infer<typeof Period>[] | null>(
    getStoredPeriodLogs,
  );

  const addPeriodLog = (periodLog: z.infer<typeof Period>) => {
    setPeriodLogs((prevLogs) => {
      try {
        const updatedPeriodLogs = [...(prevLogs ?? []), periodLog];
        window.localStorage.setItem(
          'periodLogs',
          JSON.stringify(updatedPeriodLogs),
        );

        return updatedPeriodLogs;
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Error saving period data to localStorage';
        throw new Error(message);
      }
    });
  };

  return [periodLogs, addPeriodLog] as const;
}
