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
  const branch = searchParams.get('branch');
  const minDate = searchParams.get('minDate');
  const maxDate = searchParams.get('maxDate');

  if (!workspace || !repoSlug) {
    return NextResponse.json(
      { error: 'Workspace and repoSlug parameters are required' },
      { status: 400 }
    );
  }

  try {
    const pipelines = await client.getPipelines(
      workspace, 
      repoSlug, 
      branch || undefined,
      minDate || undefined,
      maxDate || undefined
    );
    return NextResponse.json(pipelines);
  } catch (error: any) {
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pipelines' },
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
    const { workspace, repoSlug, target, variables } = body;

    if (!workspace || !repoSlug || !target) {
      return NextResponse.json(
        { error: 'Workspace, repoSlug, and target are required' },
        { status: 400 }
      );
    }

    const pipeline = await client.triggerPipeline(
      workspace,
      repoSlug,
      target,
      variables
    );
    return NextResponse.json(pipeline);
  } catch (error: any) {
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to trigger pipeline' },
      { status: 500 }
    );
  }
}
