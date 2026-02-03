'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Setting Up Bitbucket OAuth</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              To use this Bitbucket Deployment Dashboard, you need to create an OAuth consumer in your Bitbucket workspace. 
              This allows the application to authenticate users and access Bitbucket resources on their behalf.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Step-by-Step Instructions</h2>
            
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">1</span>
                  Access Bitbucket Workspace Settings
                </h3>
                <p className="text-muted-foreground ml-10">
                  Go to your Bitbucket workspace and click on <strong>Settings</strong> in the left sidebar.
                </p>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">2</span>
                  Navigate to OAuth Consumers
                </h3>
                <p className="text-muted-foreground ml-10">
                  Under <strong>Apps and features</strong>, click on <strong>OAuth consumers</strong>.
                </p>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">3</span>
                  Add a New Consumer
                </h3>
                <p className="text-muted-foreground ml-10 mb-3">
                  Click <strong>Add consumer</strong> and fill in the following details:
                </p>
                <ul className="ml-10 space-y-2 text-muted-foreground">
                  <li><strong>Name:</strong> Deployment Dashboard (or any name you prefer)</li>
                  <li><strong>Description:</strong> OAuth consumer for Bitbucket Deployment Dashboard</li>
                  <li><strong>Callback URL:</strong> <code className="bg-muted px-2 py-1 rounded text-sm">{typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/auth/callback/bitbucket</code></li>
                </ul>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">4</span>
                  Set Permissions
                </h3>
                <p className="text-muted-foreground ml-10 mb-3">
                  Select the following permissions for the OAuth consumer:
                </p>
                <ul className="ml-10 space-y-1 text-muted-foreground">
                  <li>✓ <strong>Account:</strong> Read</li>
                  <li>✓ <strong>Workspace membership:</strong> Read</li>
                  <li>✓ <strong>Projects:</strong> Read</li>
                  <li>✓ <strong>Repositories:</strong> Read</li>
                  <li>✓ <strong>Pull requests:</strong> Read</li>
                  <li>✓ <strong>Pipelines:</strong> Read</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">5</span>
                  Save and Copy Credentials
                </h3>
                <p className="text-muted-foreground ml-10 mb-3">
                  Click <strong>Save</strong>. Bitbucket will generate a <strong>Key</strong> (Client ID) and <strong>Secret</strong> (Client Secret).
                </p>
                <p className="text-muted-foreground ml-10">
                  Copy both values and paste them into the setup form on the home page.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Important Notes</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="space-y-2 text-sm">
                <li>⚠️ Keep your Client Secret secure. Never share it publicly or commit it to version control.</li>
                <li>⚠️ The credentials are stored locally in your browser. You&apos;ll need to set them up again if you clear your browser data.</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
            <p className="text-muted-foreground mb-4">
              For more detailed information about OAuth consumers in Bitbucket, visit the official documentation:
            </p>
            <a 
              href="https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                Bitbucket OAuth Documentation
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
