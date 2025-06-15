import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';

/**
 * Retrieves the authenticated user's session and clerkId.
 * Throws and error if the user is not authenticated, centralizing the
 * authorization check for all Server Actions.
 *
 * @returns {Promise<{ clerkId: string }>} An object containing the clerkId.
 */
export async function getAuthenticatedSession() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error(
      'Unauthorized: You must be logged in to perform this action.',
    );
  }

  return { clerkId };
}

/**
 * Enforces authentication for a Next.js Page component
 *
 * Checks for a valid user session. If the user is not authenticated,
 * this function will redirect them to the '/sign-in' page.
 * If the user is authenticated, it returns the clerkId.
 *
 * This function is designed for use in Server Components (Pages) where
 * a redirect is the desired side-effect for unauthenticated access.
 *
 * @returns {Promise<{ clerkId: string }>} An object containing the clerkId.
 */
export async function requirePageAuthentication() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect('/sign-in');
  }

  return { clerkId };
}
