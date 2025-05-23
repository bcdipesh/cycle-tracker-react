'use client';

import { useState, useCallback, useEffect } from 'react';

import { type PeriodLog } from '@/lib/types';
import { sortPeriods } from '@/lib/utils';

function getStoredPeriodLogs(): PeriodLog[] {
  try {
    const item = window.localStorage.getItem('periodLogs');
    const parsedItem = item ? JSON.parse(item) : [];

    return parsedItem.map((periodLog: PeriodLog) => ({
      ...periodLog,
      startDate: new Date(periodLog.startDate),
      endDate: new Date(periodLog.endDate),
    }));
  } catch (error: unknown) {
    console.error('Error retrieving period data:', error);
    return [];
  }
}

export function usePeriodLogs() {
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>([]);

  useEffect(() => {
    setPeriodLogs(getStoredPeriodLogs());
  }, []);

  const addPeriodLog = useCallback((periodLog: PeriodLog) => {
    setPeriodLogs((prevLogs) => {
      try {
        const updatedPeriodLogs = sortPeriods([...prevLogs, periodLog]);
        window.localStorage.setItem(
          'periodLogs',
          JSON.stringify(updatedPeriodLogs)
        );

        return updatedPeriodLogs;
      } catch (error: unknown) {
        console.error('Error saving period data:', error);
        return prevLogs;
      }
    });
  }, []);

  const deletePeriodLog = useCallback((id: string) => {
    setPeriodLogs((prevLogs) => {
      try {
        const updatedPeriodLogs = sortPeriods(
          prevLogs.filter((log) => log.id !== id)
        );
        window.localStorage.setItem(
          'periodLogs',
          JSON.stringify(updatedPeriodLogs)
        );

        return updatedPeriodLogs;
      } catch (error: unknown) {
        console.error('Error deleting period data:', error);
        return prevLogs;
      }
    });
  }, []);

  return [periodLogs, addPeriodLog, deletePeriodLog] as const;
}
