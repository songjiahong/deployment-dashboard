export interface BitbucketSettings {
  clientId: string;
  clientSecret: string;
}

export async function saveBitbucketSettings(settings: BitbucketSettings): Promise<boolean> {
  try {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to save Bitbucket settings:', error);
    return false;
  }
}

export async function checkBitbucketSettings(): Promise<boolean> {
  try {
    const response = await fetch('/api/settings');
    const data = await response.json();
    return data.configured === true;
  } catch (error) {
    console.error('Failed to check Bitbucket settings:', error);
    return false;
  }
}

export async function clearBitbucketSettings(): Promise<boolean> {
  try {
    const response = await fetch('/api/settings', {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to clear Bitbucket settings:', error);
    return false;
  }
}
