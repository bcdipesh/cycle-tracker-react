'use client';

import { useState, useEffect } from 'react';
import { Trash2Icon, ArrowUpDownIcon, EllipsisIcon } from 'lucide-react';
import { toast } from 'sonner';

import type { PeriodLog, SortOrder } from '@/lib/types';
import { dateFormatter, sortPeriods } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PeriodLogs({
  sortOrder = 'recent',
  setSortOrder,
  periodLogs,
  deletePeriodLogAction,
}: {
  sortOrder: SortOrder;
  setSortOrder: (value: SortOrder) => void;
  periodLogs: PeriodLog[] | { error: string };
  deletePeriodLogAction: (id: string) => Promise<void | { error: string }>;
}) {
  const [sortedPeriods, setSortedPeriods] = useState<PeriodLog[]>([]);

  async function deletePeriodLog(id: string) {
    const toastId = toast.loading('Deleting period data...');
    const result = await deletePeriodLogAction(id);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Period data deleted successfully!');
    }
    toast.dismiss(toastId);
  }

  useEffect(() => {
    if ('error' in periodLogs) {
      toast.error(periodLogs.error);
    } else {
      if (sortOrder === 'recent') {
        setSortedPeriods(sortPeriods(periodLogs, 'desc'));
      } else {
        setSortedPeriods(sortPeriods(periodLogs, 'asc'));
      }
    }
  }, [periodLogs, sortOrder]);

  let htmlOutput: React.ReactNode;

  if (sortedPeriods.length === 0) {
    htmlOutput = (
      <Card>
        <CardHeader>
          <CardTitle>
            <h3>Empty Logs</h3>
          </CardTitle>
          <CardDescription>
            <p>
              There is no available period logs to display. Start logging your
              period data using the form above.
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  } else {
    htmlOutput = (
      <ScrollArea className="h-[400px] rounded-xl border p-4 shadow-sm">
        <section className="flex flex-col gap-4">
          {sortedPeriods.map(({ id, startDate, endDate }) => {
            const formattedStartDate = dateFormatter(startDate);
            const formattedEndDate = dateFormatter(endDate);

            return (
              <Card key={id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <h3>{formattedStartDate}</h3>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Actions"
                          >
                            <EllipsisIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DialogTrigger asChild>
                            <DropdownMenuItem>
                              <Trash2Icon className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete?</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this period log for{' '}
                            {formattedStartDate}?
                            <br />
                            <br />
                            <em>Note: This action cannot be undone.</em>
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end">
                          <Button
                            variant="destructive"
                            onClick={() => deletePeriodLog(id)}
                          >
                            Delete
                          </Button>
                          <DialogClose asChild>
                            <Button variant="outline" className="mr-2">
                              Cancel
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <p>
                      <span className="font-bold">Started on: </span>
                      {`${formattedStartDate}`}
                    </p>
                    <p>
                      <span className="font-bold">Ended on: </span>
                      {`${formattedEndDate}`}
                    </p>
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
      aria-labelledby="period-logs-heading"
      className="flex flex-col gap-2"
    >
      <header>
        <h2 id="period-logs-heading" className="text-xl font-bold">
          Period Logs
        </h2>
        <p className="text-muted-foreground">
          View your logged period data here. You can add new logs using the form
          above.
        </p>
      </header>

      <Select
        onValueChange={(value: SortOrder) => setSortOrder(value)}
        defaultValue={sortOrder}
      >
        <SelectTrigger className="w-[280px]">
          <ArrowUpDownIcon />
          <p>Sort by: </p>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent" defaultChecked>
            Date (Recent to Oldest)
          </SelectItem>
          <SelectItem value="oldest">Date (Oldest to Recent)</SelectItem>
        </SelectContent>
      </Select>

      {htmlOutput}
    </section>
  );
}
