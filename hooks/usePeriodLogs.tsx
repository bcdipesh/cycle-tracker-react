'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { type PeriodLog } from '@/lib/types';
import {
  getPeriodLogs,
  createPeriodLog,
  deletePeriodLog as deletePeriodLogAction,
} from '@/lib/actions';

export function usePeriodLogs() {
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPeriodLogs() {
      try {
        const logs = await getPeriodLogs();
        setPeriodLogs(logs);
      } catch (error) {
        console.error('Error loading period logs:', error);
        toast.error('Failed to load period logs');
      } finally {
        setIsLoading(false);
      }
    }

    loadPeriodLogs();
  }, []);

  const addPeriodLog = async (periodLog: PeriodLog) => {
    try {
      const { startDate, endDate } = periodLog;
      const newLog = await createPeriodLog({ startDate, endDate });
      setPeriodLogs((prevLogs) => [newLog, ...prevLogs]);
      return newLog;
    } catch (error) {
      console.error('Error adding period log:', error);
      throw new Error('Failed to add period log');
    }
  };

  const deletePeriodLog = async (id: string) => {
    try {
      await deletePeriodLogAction(id);
      setPeriodLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
    } catch (error) {
      console.error('Error deleting period log:', error);
      throw new Error('Failed to delete period log');
    }
  };

  return [periodLogs, addPeriodLog, deletePeriodLog, isLoading] as const;
}
