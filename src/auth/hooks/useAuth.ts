'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    name: string;
    email: string;
    image: string;
  } | null;
  accessToken: string | null;
}

/**
 * Client-side hook for accessing authentication state.
 * Decouples all components from direct next-auth session access.
 */
export function useAuth(): AuthState {
  const { data: session, status } = useSession();

  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user
      ? {
          name: session.user.name || '',
          email: session.user.email || '',
          image: session.user.image || '',
        }
      : null,
    accessToken: (session as unknown as Record<string, unknown>)
      ?.accessToken as string | null,
  };
}

/**
 * Initiates GitHub OAuth sign-in.
 */
export async function loginWithGitHub() {
  await signIn('github', { callbackUrl: '/' });
}

/**
 * Signs the user out and clears the session.
 */
export async function logout() {
  await signOut({ callbackUrl: '/' });
}
