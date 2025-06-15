'use server';

import { auth } from '@clerk/nextjs/server';

import { createUserPeriod } from '@/lib/actions/period.actions';
import { OnboardingData } from '@/lib/schemas/onboarding-schema';
import { UserSettingsData } from '@/lib/schemas/usersettings-schema';
import {
  createUserSettings,
  fetchUserSettingsByClerkId,
  getUserByClerkId,
  updateUserOnboardingStatus,
  updateUserSettingsByClerkId,
} from '@/lib/services/user.service';

export async function finishUserOnboarding(onboardingData: OnboardingData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const user = await getUserByClerkId(clerkId);
  if (!user) throw new Error('User not found.');

  await updateUserOnboardingStatus({
    userId: user.id,
    isOnboardingCompleted: true,
  });
  await createUserPeriod({
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

export async function getCurrentUserSettings() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  return fetchUserSettingsByClerkId(clerkId);
}

export async function updateUserSettings(newSettingsData: UserSettingsData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  return await updateUserSettingsByClerkId({ clerkId, newSettingsData });
}
