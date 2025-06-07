'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { ChevronRight, Cog } from 'lucide-react';

import { Period } from '@/app/generated/prisma';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentPeriodAction } from '@/lib/actions';
import { dateFormatter } from '@/lib/utils';

export function CurrentCycle() {
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<Period | null>(null);
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const today = new Date();
  const fertileStartDate = new Date(period?.startDate || today);
  fertileStartDate.setDate(
    period?.startDate?.getDate() + (period?.cycleLength || 28) - 14 - 2,
  );
  const fertileEndDate = new Date(fertileStartDate);
  fertileEndDate.setDate(fertileStartDate.getDate() + 4);
  const nextPeriodStartDate = new Date(period?.startDate || today);
  nextPeriodStartDate.setDate(
    period?.startDate?.getDate() + (period?.cycleLength || 28),
  );
  const nextPeriodEndDate = new Date(nextPeriodStartDate);
  nextPeriodEndDate.setDate(nextPeriodStartDate.getDate() + 4);

  useEffect(() => {
    const fetchCycleData = async () => {
      try {
        const period = await getCurrentPeriodAction();
        setPeriod(period);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cycle data:', error);
        setIsLoading(false);
      }
    };

    fetchCycleData();
  }, []);

  return (
    <Card className="mb-6 border-0 dark:bg-gradient-to-br dark:from-rose-950 dark:via-gray-950 dark:to-gray-950">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Current Cycle</span>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Cog className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>
          {isLoading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            Math.floor(
              (today.getTime() - (period?.startDate?.getTime() || 0)) /
                MS_PER_DAY,
            ) + 1
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={46} className="h-2" />

          <div className="flex justify-between text-sm">
            <div>
              <p className="font-medium">Last Period</p>
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                <p className="text-muted-foreground">
                  {dateFormatter(period?.startDate as Date)}
                </p>
              )}
            </div>
            <div>
              <p className="font-medium">Fertile Window</p>
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                <p className="text-muted-foreground">
                  {dateFormatter(fertileStartDate)} —{' '}
                  {dateFormatter(fertileEndDate)}
                </p>
              )}
            </div>
            <div>
              <p className="font-medium">Next Period</p>
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                <p className="text-muted-foreground">
                  {dateFormatter(nextPeriodStartDate)} —{' '}
                  {dateFormatter(nextPeriodEndDate)}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/log">
              Log Today
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
