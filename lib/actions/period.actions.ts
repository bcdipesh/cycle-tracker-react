'use server';

import db from '@/lib/db';
import { PeriodData } from '@/lib/schemas/period-schema';

export async function createPeriod(periodData: PeriodData) {
  return await db.period.create({
    data: {
      ...periodData,
    },
  });
}
