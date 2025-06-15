import { clerkClient } from '@clerk/nextjs/server';

import { createUser, getUserByClerkId } from '@/lib/services/user.service';

export async function syncUser(clerkId: string) {
  const existingUser = await getUserByClerkId(clerkId);
  if (existingUser) {
    return { user: existingUser, isNew: false };
  }

  const _clerkClient = await clerkClient();
  const clerkUser = await _clerkClient.users.getUser(clerkId);
  if (!clerkUser) {
    throw new Error(`User with Clerk ID ${clerkId} not found in Clerk.`);
  }

  const newUser = await createUser({
    clerkId: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
  });

  return { user: newUser, isNew: true };
}

export async function handleAuthCallback(clerkId: string) {
  const { user, isNew } = await syncUser(clerkId);

  if (isNew || !user.onboardingCompleted) {
    return '/onboarding';
  }

  return '/dashboard';
}
