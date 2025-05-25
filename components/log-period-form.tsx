'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { cn, dateFormatter } from '@/lib/utils';
import { type PeriodLog, LogPeriodFormSchema } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function LogPeriodForm({
  addPeriodLogAction,
}: {
  addPeriodLogAction: (
    data: Omit<PeriodLog, 'id' | 'endDate'> &
      Partial<Pick<PeriodLog, 'endDate'>>
  ) => Promise<PeriodLog | { error: string }>;
}) {
  const form = useForm<z.infer<typeof LogPeriodFormSchema>>({
    resolver: zodResolver(LogPeriodFormSchema),
  });
  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof LogPeriodFormSchema>) {
    const newPeriodLog = {
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };

    const toastId = toast.loading('Saving period data...');
    const result = await addPeriodLogAction(newPeriodLog);

    if ('error' in result) {
      toast.error(result.error);
    } else {
      toast.success(
        `Period from ${dateFormatter(result.startDate)} to ${dateFormatter(
          result.endDate
        )} has been logged.`
      );
    }
    toast.dismiss(toastId);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormDescription>
                Select the start date of your period.
              </FormDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        dateFormatter(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormDescription>
                Select the end date of your period.
              </FormDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        dateFormatter(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging period...' : 'Log Period'}
        </Button>
      </form>
    </Form>
  );
}
