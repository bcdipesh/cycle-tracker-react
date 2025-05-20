import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { type PeriodLog } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormatter(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return formatter.format(date);
}

export function sortPeriods(
  periodLogs: PeriodLog[],
  sortIn: 'asc' | 'desc' = 'asc',
) {
  if (periodLogs.length === 0) return periodLogs;

  const sortedPeriods = [...periodLogs];

  if (sortIn === 'asc') {
    sortedPeriods.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  } else {
    sortedPeriods.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  return sortedPeriods;
}
