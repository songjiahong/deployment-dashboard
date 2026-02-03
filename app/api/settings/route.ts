import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SETTINGS_COOKIE = 'bitbucket_oauth_settings';
const MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, clientSecret } = body;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Client ID and Client Secret are required' },
        { status: 400 }
      );
    }

    const settings = JSON.stringify({ clientId, clientSecret });
    const encodedSettings = Buffer.from(settings).toString('base64');

    cookies().set(SETTINGS_COOKIE, encodedSettings, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const settingsCookie = cookies().get(SETTINGS_COOKIE);
    
    if (!settingsCookie?.value) {
      return NextResponse.json({ configured: false });
    }

    const settings = JSON.parse(
      Buffer.from(settingsCookie.value, 'base64').toString()
    );

    return NextResponse.json({
      configured: true,
      hasClientId: !!settings.clientId,
      hasClientSecret: !!settings.clientSecret,
    });
  } catch (error) {
    console.error('Error reading settings:', error);
    return NextResponse.json({ configured: false });
  }
}

export async function DELETE() {
  try {
    cookies().delete(SETTINGS_COOKIE);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting settings:', error);
    return NextResponse.json(
      { error: 'Failed to delete settings' },
      { status: 500 }
    );
  }
}
