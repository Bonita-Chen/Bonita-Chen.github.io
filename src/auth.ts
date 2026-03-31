import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

import { adminAllowedLogins, onlineAdminSaveConfigured } from '@/data/admin';

function isAllowedLogin(login?: string | null) {
  if (!login) {
    return false;
  }

  if (adminAllowedLogins.length === 0) {
    return true;
  }

  return adminAllowedLogins.includes(login.toLowerCase());
}

const providers = onlineAdminSaveConfigured
  ? [
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID || '',
        clientSecret: process.env.AUTH_GITHUB_SECRET || '',
        authorization: {
          params: {
            scope: 'read:user user:email',
          },
        },
        profile(profile) {
          return {
            id: String(profile.id),
            name: profile.name ?? profile.login,
            email: profile.email,
            image: profile.avatar_url,
            login: profile.login,
          };
        },
      }),
    ]
  : [];

const nextAuth = onlineAdminSaveConfigured
  ? NextAuth({
      providers,
      session: {
        strategy: 'jwt',
      },
      callbacks: {
        jwt({ token, profile, user }) {
          const login =
            (typeof (profile as { login?: unknown } | undefined)?.login ===
            'string'
              ? (profile as { login?: string }).login
              : undefined) ??
            (typeof (user as { login?: unknown } | undefined)?.login ===
            'string'
              ? (user as { login?: string }).login
              : undefined) ??
            (typeof token.login === 'string' ? token.login : undefined);

          token.login = login ?? null;
          token.isAdmin = isAllowedLogin(login);
          return token;
        },
        session({ session, token }) {
          if (session.user) {
            session.user.login =
              typeof token.login === 'string' ? token.login : null;
            session.user.isAdmin = Boolean(token.isAdmin);
          }
          return session;
        },
      },
    })
  : null;

const unavailableResponse = () =>
  Response.json(
    {
      error:
        'Online admin auth is not configured yet. Add the GitHub auth environment variables first.',
    },
    { status: 503 },
  );

export const handlers = nextAuth?.handlers ?? {
  GET: unavailableResponse,
  POST: unavailableResponse,
};

export const auth = nextAuth?.auth ?? (async () => null);
