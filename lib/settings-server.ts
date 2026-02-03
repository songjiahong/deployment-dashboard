import { cookies } from 'next/headers';

export interface BitbucketSettings {
  clientId: string;
  clientSecret: string;
}

const SETTINGS_COOKIE = 'bitbucket_oauth_settings';

export function getBitbucketSettingsServer(): BitbucketSettings | null {
  try {
    const settingsCookie = cookies().get(SETTINGS_COOKIE);
    
    if (!settingsCookie?.value) {
      return null;
    }

    const settings = JSON.parse(
      Buffer.from(settingsCookie.value, 'base64').toString()
    );

    if (!settings.clientId || !settings.clientSecret) {
      return null;
    }

    return settings;
  } catch (error) {
    console.error('Error reading Bitbucket settings from cookie:', error);
    return null;
  }
}
