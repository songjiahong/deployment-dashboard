import { NextRequest, NextResponse } from 'next/server';
import { getBitbucketClient } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const client = await getBitbucketClient();

  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const workspaces = await client.getWorkspaces();
    return NextResponse.json(workspaces);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workspaces' },
      { status: 500 }
    );
  }
}
