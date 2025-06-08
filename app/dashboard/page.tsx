import { redirect } from 'next/navigation';

import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

import { Logo } from '@/components/logo';
import { hasUserCompletedOnboarding } from '@/lib/services/user.service';

import { CurrentCycle } from './_components/current-cycle';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const isOnboardingCompleted = await hasUserCompletedOnboarding(userId);

  if (!isOnboardingCompleted) {
    redirect('/onboarding');
  }

  return (
    <main className="mx-auto max-w-md">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Logo />
        <UserButton />
      </div>

      {/* Current Period Cycle Card */}
      <CurrentCycle />
    </main>
  );
}
