import { createPeriod } from '@/lib/actions/period.actions';
import {
  createUserSettings,
  getUserFromDbByClerkId,
  getUserOnboardingStatusByClerkId,
  updateUserOnboardingStatus,
} from '@/lib/actions/user.actions';
import { OnboardingData } from '@/lib/schemas/onboarding-schema';

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
    throw new Error('User not found');
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
