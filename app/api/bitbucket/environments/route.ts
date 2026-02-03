import { NextRequest, NextResponse } from 'next/server';
import { getBitbucketClient } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const workspace = searchParams.get('workspace');
  const repoSlug = searchParams.get('repoSlug');

  if (!workspace || !repoSlug) {
    return NextResponse.json(
      { error: 'Missing workspace or repoSlug parameter' },
      { status: 400 }
    );
  }

  const client = await getBitbucketClient();

  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const environments = await client.getDeploymentEnvironments(workspace, repoSlug);
    return NextResponse.json(environments);
  } catch (error) {
    console.error('Failed to fetch environments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch environments' },
      { status: 500 }
    );
  }
}
