'use client';

import { useState, useEffect } from 'react';

import { usePeriodLogs } from '@/hooks/usePeriodLogs';

import type { SortOrder } from '@/lib/types';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogPeriodForm } from '@/components/log-period-form';
import { PeriodLogs } from '@/components/period-logs';
import { PeriodStats } from '@/components/period-stats';

export default function HomePage() {
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [periodLogs, addPeriodLog, deletePeriodLog] = usePeriodLogs();
  const [isLoading, setIsLoading] = useState(true);

  // Set loading to false after hydration
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Log your period for this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <LogPeriodForm addPeriodLog={addPeriodLog} />
        </CardContent>
      </Card>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="logs">
          <PeriodLogs
            periodLogs={periodLogs}
            deletePeriodLog={deletePeriodLog}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </TabsContent>
        <TabsContent value="stats">
          <PeriodStats periodLogs={periodLogs} />
        </TabsContent>
      </Tabs>
    </>
  );
}
