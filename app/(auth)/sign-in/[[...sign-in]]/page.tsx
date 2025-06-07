'use client';

import { SignIn } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

import { getFormAppearance } from '@/lib/clerk';

export default function SignInPage() {
  const { resolvedTheme } = useTheme();

  return <SignIn appearance={getFormAppearance(resolvedTheme)} />;
}
