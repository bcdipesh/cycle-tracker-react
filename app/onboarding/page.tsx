import { redirect } from 'next/navigation';

import { Logo } from '@/components/logo';
import { requirePageAuthentication } from '@/lib/auth';
import { hasUserCompletedOnboarding } from '@/lib/services/user.service';

import { OnboardingForm } from './_components/onboarding-form';

export default async function OnboardingPage() {
  const { clerkId } = await requirePageAuthentication();

  const hasOnboardingCompleted = await hasUserCompletedOnboarding(clerkId);
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
