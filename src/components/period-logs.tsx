import { useState } from 'react';
import { Trash2Icon, ArrowUpDownIcon, EllipsisIcon } from 'lucide-react';
import { toast } from 'sonner';

import { type PeriodLog } from '@/lib/types';
import { dateFormatter } from '@/lib/utils';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export function PeriodLogs({
  periodLogs,
  deletePeriodLog,
}: {
  periodLogs: PeriodLog[];
  deletePeriodLog: (id: string) => void;
}) {
  const [sortOrder, setSortOrder] = useState('recent');
  const sortedPeriods = [...periodLogs];
  let htmlOutput: React.ReactNode;

  if (periodLogs.length === 0) {
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
    if (sortOrder === 'oldest') {
      sortedPeriods.sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime(),
      );
    } else {
      sortedPeriods.sort(
        (a, b) => b.startDate.getTime() - a.startDate.getTime(),
      );
    }

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
                            onClick={() => {
                              try {
                                deletePeriodLog(id);
                                toast.success(
                                  'Period data deleted successfully!',
                                );
                              } catch (error: unknown) {
                                const message =
                                  error instanceof Error
                                    ? error.message
                                    : 'Error deleting period data. Please try again!';
                                toast.error(message);
                              }
                            }}
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
