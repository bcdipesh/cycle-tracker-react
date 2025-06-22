import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { type PeriodLog } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormatter(date: Date, year: boolean = false) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: year ? 'numeric' : undefined,
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

/**
 * A date correction function that takes a date object that was incorrectly
 * parsed as midnight UTC and returns a new Date object representing
 * midnight in the server's local timezone.
 * @param {Date} utcDate - The date object from Prisma.
 * @returns {Date} The corrected date object.
 */
export function correctDate(utcDate: Date): Date {
  return new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(),
  );
}
