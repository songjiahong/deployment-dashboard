import { NextRequest, NextResponse } from 'next/server';
import { getBitbucketClient } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const client = await getBitbucketClient();

  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');
  const projectKey = searchParams.get('projectKey');

  if (!workspace) {
    return NextResponse.json(
      { error: 'Workspace parameter is required' },
      { status: 400 }
    );
  }

  try {
    const repositories = projectKey
      ? await client.getRepositoriesByProject(workspace, projectKey)
      : await client.getRepositories(workspace);
    return NextResponse.json(repositories);
  } catch (error: any) {
    const status = error.status || error.response?.status;
    if (status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
