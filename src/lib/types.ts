import { z } from 'zod';

export const Period = z.object({
  id: z.string().uuid(),
  startDate: z.date().or(z.string().datetime()),
  endDate: z.date().or(z.string().datetime()),
});
