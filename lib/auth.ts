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
