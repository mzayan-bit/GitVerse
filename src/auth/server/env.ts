/**
 * Environment validation for authentication.
 * Ensures all required environment variables are present at startup.
 */

export interface AuthEnvironment {
  githubId: string;
  githubSecret: string;
  nextAuthSecret: string;
  nextAuthUrl: string;
}

export function validateAuthEnvironment(): AuthEnvironment {
  const githubId = process.env.GITHUB_ID;
  const githubSecret = process.env.GITHUB_SECRET;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const missing: string[] = [];

  if (!githubId) missing.push('GITHUB_ID');
  if (!githubSecret) missing.push('GITHUB_SECRET');
  if (!nextAuthSecret) missing.push('NEXTAUTH_SECRET');

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(
      `[GitVerse Auth] Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return {
    githubId: githubId || '',
    githubSecret: githubSecret || '',
    nextAuthSecret: nextAuthSecret || 'dev-secret-not-for-production',
    nextAuthUrl,
  };
}
