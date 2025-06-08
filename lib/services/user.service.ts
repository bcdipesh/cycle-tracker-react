import { getUserOnboardingStatusByClerkId } from '@/lib/actions/user.actions';

export async function hasUserCompletedOnboarding(clerkId: string) {
  const user = await getUserOnboardingStatusByClerkId(clerkId);

  return user?.onboardingCompleted ?? false;
}
