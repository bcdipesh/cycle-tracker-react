import { z } from 'zod';

import { TrackingGoal } from '@/app/generated/prisma';

export const onboardingSchema = z.object({
  cycleLength: z
    .number()
    .min(20, 'Must be at least 20 days')
    .max(45, 'Must be 45 days or less'),
  periodLength: z
    .number()
    .min(1, 'Must be at least 1 day')
    .max(10, 'Must be 10 days or less'),
  lastPeriodDate: z.coerce.date({ errorMap: () => ({ message: 'Please select a valid date' }) }),
  trackingGoal: z.nativeEnum(TrackingGoal),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
