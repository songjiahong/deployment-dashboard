import { NextRequest, NextResponse } from 'next/server';
import { getBitbucketClient } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const client = await getBitbucketClient();

  if (!client) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workspace = searchParams.get('workspace');

  if (!workspace) {
    return NextResponse.json(
      { error: 'Workspace parameter is required' },
      { status: 400 }
    );
  }

  try {
    const projects = await client.getProjects(workspace);
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
