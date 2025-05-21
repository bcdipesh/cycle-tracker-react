'use client';

import { type PeriodLog } from '@/lib/types';
import { dateFormatter } from '@/lib/utils';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

function getDifferenceInDays(startDate: Date, endDate: Date) {
  const startUtc = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const endUtc = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  return (startUtc - endUtc) / (1000 * 60 * 60 * 24);
}

function calculateAvgCycleLength(periodLogs: PeriodLog[]) {
  if (periodLogs.length < 2) return 0;

  let totalDays = 0;
  for (let i = 1; i < periodLogs.length; i++) {
    const prevPeriod = periodLogs[i - 1];
    const currPeriod = periodLogs[i];

    totalDays += getDifferenceInDays(
      currPeriod.startDate,
      prevPeriod.startDate
    );
  }

  return totalDays / (periodLogs.length - 1);
}

export function PeriodStats({ periodLogs }: { periodLogs: PeriodLog[] }) {
  const avgCycleLength = calculateAvgCycleLength(periodLogs);
  const lastPeriod = periodLogs[periodLogs.length - 1];
  const nextExpectedPeriod =
    avgCycleLength !== 0
      ? lastPeriod.startDate.getTime() + avgCycleLength * 24 * 60 * 60 * 1000
      : null;

  return (
    <section
      aria-labelledby="period-stats-heading"
      className="flex flex-col gap-2"
    >
      <header>
        <h2 id="period-stats-heading" className="text-xl font-bold">
          Period Stats
        </h2>

        <p className="text-muted-foreground">
          View your period statistics here like your average cycle length, next
          expected period, and other relevant information based on your logged
          data.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Average Cycle Length</CardTitle>
            <CardDescription>
              This is the average number of days between your periods.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {avgCycleLength === 0
                ? 'Insufficient data'
                : `${avgCycleLength} days`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Expected Period</CardTitle>
            <CardDescription>
              This is the estimated date of your next period based on your
              average cycle length.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {nextExpectedPeriod
                ? dateFormatter(new Date(nextExpectedPeriod))
                : 'Insufficient data'}
            </p>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
