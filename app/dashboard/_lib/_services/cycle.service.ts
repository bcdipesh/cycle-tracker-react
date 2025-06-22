import {
  addDays,
  differenceInCalendarDays,
  isValid,
  startOfToday,
} from 'date-fns';

/**
 * Calculates the current ordinal day of a cycle from its start date.
 * Day 1 is the start date itself. The calculation is inclusive and
 * based on calendar days, making it robust against time zone issues.
 *
 * @param {Date | undefined} periodStartDate - The start date of the period.
 * @returns {number | null} The current day number of the cycle (e.g., 1, 2, 3),
 * or null if the start date is invalid or in the future.
 */
export function calculateCurrentPeriodCycle(periodStartDate?: Date) {
  if (!periodStartDate || !isValid(periodStartDate)) {
    return null;
  }

  const today = startOfToday();
  if (periodStartDate > today) {
    return null;
  }

  const calendarDaysDifference = differenceInCalendarDays(
    today,
    periodStartDate,
  );

  // The + 1 converts the 0-indexed duration calculated by the machine
  // into the 1-indexed ordinal day number expected by the users.
  return calendarDaysDifference + 1;
}

/**
 * Predicts the start and end dates for the next menstrual period.
 *
 * @param {object} params - The prediction parameters.
 * @param {Date} params.lastPeriodStartDate - The start date of the last known period.
 * @param {number} [params.averageCycleLength=28] - The user's average cycle length in days.
 * @param {number} [params.averagePeriodLength=5] - The user's average period duration in days.
 * @returns {{startDate: Date, endDate: Date} | null} The predicted start and end dates, or null.
 */
export function predictNextPeriod({
  lastPeriodStartDate,
  averageCycleLength = 28,
  averagePeriodLength = 5,
}: {
  lastPeriodStartDate: Date;
  averageCycleLength?: number;
  averagePeriodLength?: number;
}) {
  if (!lastPeriodStartDate || !isValid(lastPeriodStartDate)) {
    return null;
  }

  const nextStartDate = addDays(lastPeriodStartDate, averageCycleLength);
  const nextEndDate = addDays(nextStartDate, averagePeriodLength - 1);

  return {
    startDate: nextStartDate,
    endDate: nextEndDate,
  };
}

/**
 * Predicts the fertile window for the upcoming menstrual cycle based on the last one.
 * The fertile window is anchored to the predicted start date of the next cycle.
 *
 * @param {object} params - The prediction parameters.
 * @param {Date} params.lastPeriodStartDate - The start date of the last known period.
 * @param {number} [params.averageCycleLength=28] - The user's average cycle length in days.
 * @returns {{startDate: Date, endDate: Date} | null} The predicted start and end dates of the fertile window, or null.
 */
export function predictFertileWindowForNextCycle({
  lastPeriodStartDate,
  averageCycleLength = 28,
}: {
  lastPeriodStartDate: Date;
  averageCycleLength?: number;
}) {
  if (!lastPeriodStartDate || !isValid(lastPeriodStartDate)) {
    return null;
  }

  const nextCycleStartDate = addDays(lastPeriodStartDate, averageCycleLength);
  const fertileWindowStartDayInCycle = averageCycleLength - 19;
  const fertileWindowEndDayInCycle = averageCycleLength - 13;

  // We subtract 1 because addDays is
  // 0-indexed (adding 0 days gives the same day).
  const startDate = addDays(
    nextCycleStartDate,
    fertileWindowStartDayInCycle - 1,
  );
  const endDate = addDays(nextCycleStartDate, fertileWindowEndDayInCycle - 1);

  return {
    startDate,
    endDate,
  };
}
