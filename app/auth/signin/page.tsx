'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, HelpCircle, Book, Trash2, Settings } from 'lucide-react';
import { checkBitbucketSettings, clearBitbucketSettings } from '@/lib/settings';
import BitbucketSetup from '@/components/BitbucketSetup';

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasSettings, setHasSettings] = useState<boolean | null>(null);

  useEffect(() => {
    checkBitbucketSettings().then(setHasSettings);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading' || hasSettings === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasSettings) {
    return <BitbucketSetup />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <GitBranch className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Bitbucket Deployment Dashboard</CardTitle>
            <CardDescription className="mt-2">
              Sign in with your Bitbucket account to manage and monitor deployments
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => signIn('bitbucket', { callbackUrl: '/' })}
            className="w-full h-12 text-base"
            size="lg"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z" />
            </svg>
            Sign in with Bitbucket
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to access your Bitbucket repositories and deployment information
          </p>
          <div className="pt-4 border-t space-y-2">
            <button
              onClick={() => router.push('/settings')}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4" />
              Update OAuth Settings
            </button>
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to clear your OAuth credentials? You will need to reconfigure them.')) {
                  const result = await clearBitbucketSettings();
                  if (result) {
                    setHasSettings(false);
                  }
                }
              }}
              className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Settings & Reconfigure
            </button>
            <button
              onClick={() => router.push('/help/manual')}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Book className="w-4 h-4" />
              View Dashboard Manual
            </button>
            <button
              onClick={() => router.push('/help')}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Need help setting up OAuth credentials?
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
