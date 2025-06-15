'use server';

import { auth } from '@clerk/nextjs/server';

import { PeriodData } from '@/lib/schemas/period-schema';
import { createPeriodInDb } from '@/lib/services/period.service';
import { getUserByClerkId } from '@/lib/services/user.service';

export async function createUserPeriod(periodData: PeriodData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error('User not found.');
  }
  const internalUserId = user.id;

  return await createPeriodInDb({
    userId: internalUserId,
    periodData,
  });
}
