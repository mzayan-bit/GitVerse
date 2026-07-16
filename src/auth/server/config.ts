/**
 * NextAuth configuration — the single source of truth for auth options.
 * Moved from src/lib/auth.ts to src/auth/server/config.ts for modularity.
 */

import { NextAuthOptions, getServerSession } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { validateAuthEnvironment } from './env';

const env = validateAuthEnvironment();

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: env.githubId,
      clientSecret: env.githubSecret,
      authorization: {
        params: {
          scope: 'read:user user:email read:org repo',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
      };
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/',
  },
  secret: env.nextAuthSecret,
};

/**
 * Retrieves the server-side session. Used in server components and API routes.
 */
export const getAuthSession = () => getServerSession(authOptions);
