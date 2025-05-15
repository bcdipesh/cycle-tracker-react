import { z } from 'zod';

export const Period = z.object({
  startDate: z.date().or(z.string().datetime()),
  endDate: z.date().or(z.string().datetime()),
});
