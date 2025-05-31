import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { SignUpForm } from "./_components/sign-up";

export default function Page() {
  return (
    <main className="mx-auto max-w-md">
      <div className="flex min-h-screen flex-col items-center justify-center">
        {/* Header */}
        <div className="mb-8 ml-4 flex items-center self-start">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="sr-only">Back to home</span>
            </Button>
          </Link>
          <Logo />
        </div>

        {/* Sign-up form */}
        <SignUpForm />

        {/* Terms of service */}
        <div className="text-muted-foreground mt-8 text-center text-xs">
          <p>
            By signing in, you agree to our{" "}
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
