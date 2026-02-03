import { NextRequest, NextResponse } from 'next/server';
import { getBitbucketClient } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const client = await getBitbucketClient();

  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  const repoSlug = searchParams.get('repoSlug');

  if (!workspace || !repoSlug) {
    return NextResponse.json(
      { error: 'Workspace and repoSlug parameters are required' },
      { status: 400 }
    );
  }

  try {
    const deployments = await client.getDeployments(workspace, repoSlug);
    return NextResponse.json(deployments);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch deployments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const client = await getBitbucketClient();

  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { workspace, repoSlug, environmentUuid, commitHash } = body;

    if (!workspace || !repoSlug || !environmentUuid) {
      return NextResponse.json(
        { error: 'Workspace, repoSlug, and environmentUuid are required' },
        { status: 400 }
      );
    }

    const deployment = await client.triggerDeployment(
      workspace,
      repoSlug,
      environmentUuid,
      commitHash
    );
    return NextResponse.json(deployment);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to trigger deployment' },
      { status: 500 }
    );
  }
}
