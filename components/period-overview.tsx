'use client';

import { useState } from 'react';

import type { PeriodLog, SortOrder } from '@/lib/types';

import { PeriodLogs } from '@/components/period-logs';
import { PeriodStats } from '@/components/period-stats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PeriodOverview({
  periodLogs,
  deletePeriodLogAction,
}: {
  periodLogs: PeriodLog[] | { error: string };
  deletePeriodLogAction: (id: string) => Promise<void | { error: string }>;
}) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');

  return (
    <Tabs defaultValue="logs" className="w-full">
      <TabsList>
        <TabsTrigger value="logs">Logs</TabsTrigger>
        <TabsTrigger value="stats">Stats</TabsTrigger>
      </TabsList>
      <TabsContent value="logs">
        <PeriodLogs
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          periodLogs={periodLogs}
          deletePeriodLogAction={deletePeriodLogAction}
        />
      </TabsContent>
      <TabsContent value="stats">
        <PeriodStats periodLogs={periodLogs} />
      </TabsContent>
    </Tabs>
  );
}
