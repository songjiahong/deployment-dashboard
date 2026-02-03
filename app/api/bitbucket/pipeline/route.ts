import { NextRequest, NextResponse } from 'next/server';
import { getBitbucketClient } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const workspace = searchParams.get('workspace');
  const repoSlug = searchParams.get('repoSlug');
  const pipelineUuid = searchParams.get('pipelineUuid');

  if (!workspace || !repoSlug || !pipelineUuid) {
    return NextResponse.json(
      { error: 'Missing workspace, repoSlug, or pipelineUuid parameter' },
      { status: 400 }
    );
  }

  const client = await getBitbucketClient();

  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pipeline = await client.getPipeline(workspace, repoSlug, pipelineUuid);
    if (!pipeline) {
      return NextResponse.json({ error: 'Pipeline not found' }, { status: 404 });
    }
    return NextResponse.json(pipeline);
  } catch (error) {
    console.error('Failed to fetch pipeline:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pipeline' },
      { status: 500 }
    );
  }
}
