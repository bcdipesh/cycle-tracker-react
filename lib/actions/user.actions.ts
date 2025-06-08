import db from '@/lib/db';

export type CreateUserParams = {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
};

export async function getUserFromDbByClerkId(clerkId: string) {
  return await db.user.findUnique({
    where: { clerkId },
  });
}

export async function createUser(userData: CreateUserParams) {
  return await db.user.create({
    data: userData,
  });
}

export async function getUserOnboardingStatusByClerkId(clerkId: string) {
  return await db.user.findUnique({
    where: { clerkId },
    select: {
      onboardingCompleted: true,
    },
  });
}
