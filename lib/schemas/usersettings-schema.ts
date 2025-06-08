import { z } from 'zod';

import { TrackingGoal } from '@/app/generated/prisma';

export const userSettingsSchema = z.object({
  userId: z.string(),
  averageCycleLength: z.number().optional(),
  averagePeriodLength: z.number().optional(),
  reminderDaysBefore: z.number().optional(),
  enableNotifications: z.boolean().optional(),
  trackingGoal: z.nativeEnum(TrackingGoal).optional(),
});

export type UserSettingsData = z.infer<typeof userSettingsSchema>;
