import { z } from 'zod';

import { TrackingGoal } from '@/app/generated/prisma';

export const userSettingsSchema = z.object({
  userId: z.string(),
  averageCycleLength: z.coerce
    .number()
    .min(20, 'Must be at least 20')
    .optional(),
  averagePeriodLength: z.coerce
    .number()
    .min(1, 'Must be at least 1')
    .optional(),
  reminderDaysBefore: z.coerce.number().min(0, 'Cannot be negative').optional(),
  enableNotifications: z.boolean().optional(),
  trackingGoal: z.nativeEnum(TrackingGoal).optional(),
});

export type UserSettingsData = z.infer<typeof userSettingsSchema>;
