import type { z } from 'zod';
import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';

import { dateFormatter } from '@/lib/utils';
import { Period } from '@/lib/types';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function PeriodLogs({
  periodLogs,
}: {
  periodLogs: z.infer<typeof Period>[] | null;
}) {
  const [sortOrder, setSortOrder] = useState('recent');
  let sortedPeriods = periodLogs ?? [];
  let htmlOutput: React.ReactNode;

  if (!periodLogs) {
    htmlOutput = (
      <Card>
        <CardHeader>
          <CardTitle>
            <h3>
              No period data logged yet to display. Start logging your period
              data using the form above.
            </h3>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  } else {
    if (sortOrder === 'oldest') {
      sortedPeriods = sortedPeriods.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
    } else {
      sortedPeriods = sortedPeriods.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );
    }

    htmlOutput = (
      <ScrollArea className="h-[400px] rounded-xl border p-4 shadow-sm">
        <section className="flex flex-col gap-4">
          {sortedPeriods.map(({ id, startDate, endDate }) => {
            const formattedStartDate = dateFormatter(new Date(startDate));
            const formattedEndDate = dateFormatter(new Date(endDate));

            return (
              <Card key={id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <h3>{formattedStartDate}</h3>
                    <Button variant="destructive" size="icon">
                      <Trash2Icon />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {`Start Date: ${formattedStartDate}`}
                  </CardDescription>
                  <CardDescription>
                    {`End Date: ${formattedEndDate}`}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </ScrollArea>
    );
  }

  return (
    <section
      aria-labelledby="period-logs-title"
      className="flex flex-col gap-2"
    >
      <header>
        <h2 id="period-logs-title" className="text-xl font-bold">
          Period Logs
        </h2>
        <p className="text-muted-foreground">
          View your logged period data here. You can add new logs using the form
          above.
        </p>
      </header>

      <Select
        onValueChange={(value) => setSortOrder(value)}
        defaultValue={sortOrder}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort peroids" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent" defaultChecked>
            Recent
          </SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectContent>
      </Select>

      {htmlOutput}
    </section>
  );
}
