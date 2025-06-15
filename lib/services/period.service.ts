import db from '@/lib/db';
import { PeriodData } from '@/lib/schemas/period-schema';

export async function createPeriodInDb({
  userId,
  periodData,
}: {
  userId: string;
  periodData: PeriodData;
}) {
  return await db.period.create({
    data: {
      ...periodData,
      userId,
    },
  });
}
