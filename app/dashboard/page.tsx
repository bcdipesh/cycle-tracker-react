import { redirect } from 'next/navigation';

import { UserButton } from '@clerk/nextjs';

import { Logo } from '@/components/logo';
import { requirePageAuthentication } from '@/lib/auth';
import { hasUserCompletedOnboarding } from '@/lib/services/user.service';

import { CurrentCycle } from './_components/current-cycle';

export default async function DashboardPage() {
  const { clerkId } = await requirePageAuthentication();

  const isOnboardingCompleted = await hasUserCompletedOnboarding(clerkId);
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
