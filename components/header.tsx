import Link from 'next/link';

import { Logo } from './logo';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <Logo />
        <div className="space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
