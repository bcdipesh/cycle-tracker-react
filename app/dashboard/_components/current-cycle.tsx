'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { format } from 'date-fns';
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
import { correctDate } from '@/lib/utils';

import {
  calculateCurrentPeriodCycle,
  predictFertileWindowForNextCycle,
  predictNextPeriod,
} from '../_lib/_services/cycle.service';

export function CurrentCycle() {
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<Period | null>(null);

  let nextPeriod = null;
  if (period?.startDate) {
    nextPeriod = predictNextPeriod({
      lastPeriodStartDate: correctDate(period.startDate),
    });
  }

  let nextFertileWindow = null;
  if (period?.startDate) {
    nextFertileWindow = predictFertileWindowForNextCycle({
      lastPeriodStartDate: correctDate(period.startDate),
    });
  }

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
          ) : period?.startDate ? (
            calculateCurrentPeriodCycle(correctDate(period.startDate))
          ) : (
            <p className="text-muted-foreground">No data</p>
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
              ) : period?.startDate ? (
                <p className="text-muted-foreground">
                  {format(correctDate(period.startDate), 'MMM dd')}
                </p>
              ) : (
                <p className="text-muted-foreground">No data</p>
              )}
            </div>
            <div>
              <p className="font-medium">Fertile Window</p>
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : nextFertileWindow ? (
                <p className="text-muted-foreground">
                  {format(correctDate(nextFertileWindow.startDate), 'MMM dd')} —{' '}
                  {format(correctDate(nextFertileWindow.endDate), 'MMM dd')}
                </p>
              ) : (
                <p className="text-muted-foreground">No data</p>
              )}
            </div>
            <div>
              <p className="font-medium">Next Period</p>
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : nextPeriod ? (
                <p className="text-muted-foreground">
                  {format(correctDate(nextPeriod.startDate), 'MMM dd')} —{' '}
                  {format(correctDate(nextPeriod.endDate), 'MMM dd')}
                </p>
              ) : (
                <p className="text-muted-foreground">No data</p>
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
