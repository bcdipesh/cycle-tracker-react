import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-md">
      <div className="flex min-h-screen flex-col items-center justify-center">
        {/* Header */}
        <div className="mb-8 ml-4 flex items-center self-start">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to home</span>
            </Button>
          </Link>
          <Logo />
        </div>

        {/* Sign-in/sign-up form */}
        {children}

        {/* Footer */}
        <div className="text-muted-foreground mt-8 text-center text-xs">
          <p>
            By signing in, you agree to our{' '}
            <Link href="/terms-of-service" className="hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
