import { NextRequest, NextResponse } from 'next/server';
import { getBitbucketClient } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const workspace = searchParams.get('workspace');
  const repoSlug = searchParams.get('repoSlug');
  const commitHash = searchParams.get('commitHash');

  if (!workspace || !repoSlug || !commitHash) {
    return NextResponse.json(
      { error: 'Missing workspace, repoSlug, or commitHash parameter' },
      { status: 400 }
    );
  }

  const client = await getBitbucketClient();

  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const commit = await client.getCommit(workspace, repoSlug, commitHash);
    if (!commit) {
      return NextResponse.json({ error: 'Commit not found' }, { status: 404 });
    }
    return NextResponse.json(commit);
  } catch (error) {
    console.error('Failed to fetch commit:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commit' },
      { status: 500 }
    );
  }
}
