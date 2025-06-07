'use client';

import { SignUp } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

import { getFormAppearance } from '@/lib/clerk';

export default function SignUpPage() {
  const { resolvedTheme } = useTheme();

  return <SignUp appearance={getFormAppearance(resolvedTheme)} />;
}
