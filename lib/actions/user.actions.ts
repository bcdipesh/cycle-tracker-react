'use server';

import { createUserPeriod } from '@/lib/actions/period.actions';
import { getAuthenticatedSession } from '@/lib/auth';
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
  const { clerkId } = await getAuthenticatedSession();

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
  const { clerkId } = await getAuthenticatedSession();

  return fetchUserSettingsByClerkId(clerkId);
}

export async function updateUserSettings(newSettingsData: UserSettingsData) {
  const { clerkId } = await getAuthenticatedSession();

  return await updateUserSettingsByClerkId({ clerkId, newSettingsData });
}
