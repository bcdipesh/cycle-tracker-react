'use server';

import db from '@/lib/db';
import { UserSettingsData } from '@/lib/schemas/usersettings-schema';

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

export async function updateUserOnboardingStatus(
  userId: string,
  isOnboardingCompleted: boolean,
) {
  return await db.user.update({
    where: { id: userId },
    data: {
      onboardingCompleted: isOnboardingCompleted,
    },
  });
}

export async function createUserSettings(userSettingsData: UserSettingsData) {
  return await db.userSettings.create({
    data: userSettingsData,
  });
}

export async function getUserSettingsFromDbById(id: string) {
  return await db.userSettings.findUnique({
    where: { userId: id },
  });
}
