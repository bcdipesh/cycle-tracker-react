import { createPeriod } from '@/lib/actions/period.actions';
import {
  createUserSettings,
  getUserFromDbByClerkId,
  getUserOnboardingStatusByClerkId,
  updateUserOnboardingStatus,
} from '@/lib/actions/user.actions';
import db from '@/lib/db';
import { OnboardingData } from '@/lib/schemas/onboarding-schema';
import { UserSettingsData } from '@/lib/schemas/usersettings-schema';

export async function hasUserCompletedOnboarding(clerkId: string) {
  const user = await getUserOnboardingStatusByClerkId(clerkId);

  return user?.onboardingCompleted ?? false;
}

export async function finishUserOnboarding(
  clerkId: string,
  onboardingData: OnboardingData,
) {
  const user = await getUserFromDbByClerkId(clerkId);
  if (!user) {
    throw new Error('User not found.');
  }

  await updateUserOnboardingStatus(user.id, true);
  await createPeriod({
    userId: user.id,
    startDate: onboardingData.lastPeriodDate,
  });
  await createUserSettings({
    userId: user.id,
    averageCycleLength: onboardingData.cycleLength,
    averagePeriodLength: onboardingData.periodLength,
    trackingGoal: onboardingData.trackingGoal,
  });
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

export async function updateUserSettingsByClerkId(
  clerkId: string,
  data: UserSettingsData,
) {
  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) {
    throw new Error('User not found.');
  }

  const { userId, ...updateData } = data;

  return await db.userSettings.update({
    where: { userId: user.id },
    data: updateData,
  });
}
