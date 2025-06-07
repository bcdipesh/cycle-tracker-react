import { UserButton } from '@clerk/nextjs';

import { Logo } from '@/components/logo';

import { CurrentCycle } from './_components/current-cycle';

export default function DashboardPage() {
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
