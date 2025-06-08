import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';

import { Logo } from '@/components/logo';
import { hasUserCompletedOnboarding } from '@/lib/services/user.service';

import { OnboardingForm } from './_components/onboarding-form';

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const hasOnboardingCompleted = await hasUserCompletedOnboarding(userId);

  if (hasOnboardingCompleted) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 flex items-center justify-center">
          <Logo />
        </div>

        <OnboardingForm />
      </div>
    </main>
  );
}
