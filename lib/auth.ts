import { getServerSession } from 'next-auth';
import { getAuthOptions } from './auth-options';
import { BitbucketClient } from './bitbucket';

export async function getBitbucketClient(): Promise<BitbucketClient | null> {
  const authMethod = process.env.AUTH_METHOD || 'oauth';

  if (authMethod === 'token') {
    const apiToken = process.env.BITBUCKET_API_TOKEN;
    const username = process.env.BITBUCKET_USERNAME;

    if (!apiToken || !username) {
      console.error('BITBUCKET_API_TOKEN and BITBUCKET_USERNAME must be set when using token auth');
      return null;
    }

    return new BitbucketClient(undefined, username, apiToken);
  } else {
    const session = await getServerSession(getAuthOptions());

    if (!session?.accessToken) {
      return null;
    }

    return new BitbucketClient(session.accessToken);
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const authMethod = process.env.AUTH_METHOD || 'oauth';

  if (authMethod === 'token') {
    return !!(process.env.BITBUCKET_API_TOKEN && process.env.BITBUCKET_USERNAME);
  } else {
    const session = await getServerSession(getAuthOptions());
    return !!session?.accessToken;
  }
}
