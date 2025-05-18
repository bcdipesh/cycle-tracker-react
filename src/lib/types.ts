import { z } from 'zod';

export const LogPeriodFormSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date().refine((date) => date),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date.',
    path: ['endDate'],
  });

export const PeriodLogSchema = z.object({
  id: z.string().uuid(),
  startDate: z.date(),
  endDate: z.date(),
});

export type PeriodLog = z.infer<typeof PeriodLogSchema>;
