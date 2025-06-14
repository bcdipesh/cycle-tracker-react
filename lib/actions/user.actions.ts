'use server';

import { auth } from '@clerk/nextjs/server';

import db from '@/lib/db';
import { UserSettingsData } from '@/lib/schemas/usersettings-schema';
import {
  fetchUserSettingsByClerkId,
  updateUserSettingsByClerkId,
} from '@/lib/services/user.service';

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

export async function getCurrentUserSettings() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  return fetchUserSettingsByClerkId(clerkId);
}

export async function updateUserSettings(data: UserSettingsData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  return await updateUserSettingsByClerkId(clerkId, data);
}
