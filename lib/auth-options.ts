import { NextAuthOptions } from 'next-auth';
import { getBitbucketSettingsServer } from './settings-server';

export function getAuthOptions(): NextAuthOptions {
  const settings = getBitbucketSettingsServer();
  
  return {
    providers: [
      {
        id: 'bitbucket',
        name: 'Bitbucket',
        type: 'oauth',
        version: '2.0',
        authorization: {
          url: 'https://bitbucket.org/site/oauth2/authorize',
          params: { 
            scope: 'account repository pipeline',
          },
        },
        token: {
          url: 'https://bitbucket.org/site/oauth2/access_token',
          params: {
            grant_type: 'authorization_code',
          },
        },
        userinfo: {
          url: 'https://api.bitbucket.org/2.0/user',
          async request({ tokens, provider }) {
            const response = await fetch('https://api.bitbucket.org/2.0/user', {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            });
            return await response.json();
          },
        },
        clientId: settings?.clientId || process.env.BITBUCKET_CLIENT_ID || '',
        clientSecret: settings?.clientSecret || process.env.BITBUCKET_CLIENT_SECRET || '',
        profile(profile) {
          return {
            id: profile.uuid,
            name: profile.display_name,
            email: profile.email,
            image: profile.links?.avatar?.href,
          };
        },
      },
    ],
    callbacks: {
      async jwt({ token, account }) {
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
        }
        return token;
      },
      async session({ session, token }) {
        session.accessToken = token.accessToken as string;
        return session;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
}
