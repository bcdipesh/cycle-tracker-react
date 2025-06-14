'use client';

import { useEffect, useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { SubmitButton } from '@/components/submit-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { updateUserSettings } from '@/lib/actions/user.actions';
import {
  UserSettingsData,
  userSettingsSchema,
} from '@/lib/schemas/usersettings-schema';

type SettingsFormProps = {
  settings: UserSettingsData;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserSettingsData>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: settings || {
      averageCycleLength: 0,
      averagePeriodLength: 0,
      enableNotifications: false,
      reminderDaysBefore: 0,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const onSubmit = (data: UserSettingsData) => {
    startTransition(async () => {
      const result = await updateUserSettings(data);

      if (result) {
        form.reset(result);
        toast.success('Settings updated successfully.');
      } else {
        toast.error('Failed to update settings.');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cycle Settings</CardTitle>
            <CardDescription>
              Customize your cycle tracking experience by adjusting the average
              length of your menstrual cycle and period.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="averageCycleLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Cycle Length</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the average length of your menstrual cycle in days.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="averagePeriodLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Period Length</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the average length of your menstrual period in days.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              name="enableNotifications"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Enable Notifications</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Enable or disable period reminders. If enabled, you will
                    receive a reminder based on the number of days you set
                    below.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reminderDaysBefore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder Days Before</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Set the number of days before your period that you want to
                    receive a reminder.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <SubmitButton isSubmitting={isPending}>Save Changes</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
