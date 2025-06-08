import { z } from 'zod';

import { Flow } from '@/app/generated/prisma';

export const periodSchema = z.object({
  userId: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  cycleLength: z.number().optional(),
  flow: z.nativeEnum(Flow).optional(),
  symptoms: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export type PeriodData = z.infer<typeof periodSchema>;
