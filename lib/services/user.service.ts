import db from '@/lib/db';
import { UserSettingsData } from '@/lib/schemas/usersettings-schema';

export type CreateUserParams = {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
};

export async function createUser(userData: CreateUserParams) {
  return await db.user.create({
    data: userData,
  });
}

export async function getUserByClerkId(clerkId: string) {
  return await db.user.findUnique({
    where: { clerkId },
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

export async function updateUserOnboardingStatus({
  userId,
  isOnboardingCompleted,
}: {
  userId: string;
  isOnboardingCompleted: boolean;
}) {
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

export async function hasUserCompletedOnboarding(clerkId: string) {
  const user = await getUserOnboardingStatusByClerkId(clerkId);

  return user?.onboardingCompleted ?? false;
}

export async function fetchUserSettingsByClerkId(clerkId: string) {
  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      UserSettings: true,
    },
  });
  if (!user) {
    throw new Error('User not found.');
  }

  return user.UserSettings;
}

export async function updateUserSettingsByClerkId({
  clerkId,
  newSettingsData,
}: {
  clerkId: string;
  newSettingsData: UserSettingsData;
}) {
  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) {
    throw new Error('User not found.');
  }

  const { userId, ...updateData } = newSettingsData;

  return await db.userSettings.update({
    where: { userId: user.id },
    data: updateData,
  });
}
