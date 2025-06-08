import { NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs/server';

import { handleAuthCallback } from '@/lib/services/auth.service';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const redirectPath = await handleAuthCallback(userId);

    const absoluteUrl = new URL(redirectPath, process.env.NEXT_PUBLIC_BASE_URL);
    return NextResponse.redirect(absoluteUrl);
  } catch (error) {
    console.error('Error completing sign-up:', error);

    return new Response('An internal error occurred. Please try again.', {
      status: 500,
    });
  }
}
