import Link from "next/link";
import { CogIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CurrentCycle } from "./_components/current-cycle";
import { Logo } from "@/components/logo";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-md">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Logo />
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <CogIcon className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
      </div>

      {/* Current Period Cycle Card */}
      <CurrentCycle />
    </main>
  );
}
