'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, GitBranch, RefreshCw, Play, Trash2, Plus, CheckCircle2, XCircle, Clock, AlertCircle, ChevronDown, ChevronRight, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ManualPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <h1 className="text-4xl font-bold mb-4">Dashboard User Manual</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A comprehensive guide to using the Bitbucket Deployment Dashboard
        </p>

        {/* Overview Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <GitBranch className="w-6 h-6" />
            Overview
          </h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <p>
              The Bitbucket Deployment Dashboard provides a centralized view of all your deployment environments across multiple projects and repositories. It helps you monitor deployment status, track changes, and manage deployments efficiently.
            </p>
            <p className="font-semibold">Key Features:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>View deployments across multiple workspaces and projects</li>
              <li>Monitor deployment status for Test and Production environments</li>
              <li>Track commit messages and pipeline numbers</li>
              <li>Quick access to deploy to production</li>
              <li>Customizable project and repository selection</li>
            </ul>
          </div>
        </section>

        {/* Workspace Selection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Workspace Selection</h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <p>
              At the top of the dashboard, you can select which Bitbucket workspace to view. The dashboard will remember your last selected workspace.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">💡 Tip:</p>
              <p className="text-sm text-blue-800">
                If no workspace is saved, the dashboard automatically selects the first workspace in your list.
              </p>
            </div>
          </div>
        </section>

        {/* Project Management */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Project Management</h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Adding/Removing Projects</h3>
            <p>
              You can control which projects are displayed on your dashboard:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Add a project:</strong> Click the project button (with <Plus className="w-3 h-3 inline" /> icon) to add it to your view
              </li>
              <li>
                <strong>Remove a project:</strong> Click the highlighted project button (with <Trash2 className="w-3 h-3 inline" /> icon) to remove it
              </li>
              <li>Your project selections are saved automatically and persist across sessions</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6">Collapsing/Expanding Projects</h3>
            <p>
              Each project card can be collapsed or expanded using the <ChevronDown className="w-4 h-4 inline" /> / <ChevronRight className="w-4 h-4 inline" /> button in the project header. This helps you focus on specific projects while keeping others hidden.
            </p>
          </div>
        </section>

        {/* Repository Management */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Repository Management</h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Showing/Hiding Repositories</h3>
            <p>
              Within each project, you can control which repositories are visible:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Checkbox:</strong> Each repository has a checkbox next to its name
              </li>
              <li>
                <strong>Checked:</strong> Repository is visible in the table
              </li>
              <li>
                <strong>Unchecked:</strong> Repository is hidden from view
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-6">Adding Hidden Repositories</h3>
            <p>
              If you have hidden repositories, you can add them back:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Look for the &quot;Add Repository&quot; dropdown at the top of the project table</li>
              <li>Select the repository you want to add from the dropdown</li>
              <li>Click the <Plus className="w-3 h-3 inline" /> Add button</li>
            </ol>
          </div>
        </section>

        {/* Deployment Status */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Understanding Deployment Status</h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <p>
              Each deployment is displayed with a status badge indicating its current state:
            </p>
            <div className="space-y-3 ml-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 text-green-800 text-sm font-medium">
                  <CheckCircle2 className="w-3 h-3" /> SUCCESSFUL
                </span>
                <span>Deployment completed successfully</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-800 text-sm font-medium">
                  <XCircle className="w-3 h-3" /> FAILED
                </span>
                <span>Deployment failed or encountered an error</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-sm font-medium">
                  <Clock className="w-3 h-3" /> IN PROGRESS
                </span>
                <span>Deployment is currently running</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium">
                  <AlertCircle className="w-3 h-3" /> UNKNOWN
                </span>
                <span>Status could not be determined</span>
              </div>
            </div>
          </div>
        </section>

        {/* Deployment Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Deployment Information</h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <p>
              For each repository and environment, the dashboard displays:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Status Badge:</strong> Current deployment status (Successful, Failed, In Progress, etc.)
              </li>
              <li>
                <strong>Pipeline Number:</strong> The pipeline number or name (e.g., #123)
              </li>
              <li>
                <strong>Commit Information:</strong> Short commit hash and commit message
              </li>
              <li>
                <strong>Deployment Date:</strong> When the deployment was created
              </li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Important:</p>
              <p className="text-sm text-yellow-800">
                For Production environments, only successful deployments are shown to ensure you always see the latest stable deployment.
              </p>
            </div>
          </div>
        </section>

        {/* Production Deployment Indicator */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Production Deployment Indicator</h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <p>
              The dashboard uses color coding to help you quickly identify production deployment status:
            </p>
            <div className="space-y-3 ml-4">
              <div className="flex items-start gap-3">
                <div className="w-16 h-12 bg-green-50 border border-green-200 rounded flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Green Background</p>
                  <p className="text-sm text-muted-foreground">
                    Production is up-to-date with Test environment (same pipeline number)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-16 h-12 bg-yellow-50 border border-yellow-200 rounded flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Yellow Background</p>
                  <p className="text-sm text-muted-foreground">
                    Production is behind Test environment (different pipeline number)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">💡 Tip:</p>
              <p className="text-sm text-blue-800">
                When production has a yellow background, a &quot;Deploy to Prod&quot; button will appear in the Actions column, allowing you to quickly navigate to Bitbucket to deploy the latest changes.
              </p>
            </div>
          </div>
        </section>

        {/* Deploy to Production */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Deploy to Production</h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <p>
              When Test and Production environments have different pipeline numbers, a <Play className="w-3 h-3 inline" /> &quot;Deploy to Prod&quot; button appears in the Actions column.
            </p>
            <p>
              Clicking this button will:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Open the Bitbucket deployments page for that repository in a new tab</li>
              <li>Allow you to trigger a production deployment directly in Bitbucket</li>
            </ol>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Note:</p>
              <p className="text-sm text-yellow-800">
                The actual deployment must be triggered in Bitbucket. The dashboard provides quick access but does not trigger deployments directly.
              </p>
            </div>
          </div>
        </section>

        {/* Refresh Data */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Refreshing Data</h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <p>
              To get the latest deployment information:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Click the <RefreshCw className="w-4 h-4 inline" /> Refresh button in the top-right corner</li>
              <li>The dashboard will reload all deployment data for your selected projects</li>
              <li>The button will show a spinning animation while refreshing</li>
            </ol>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">💡 Tip:</p>
              <p className="text-sm text-blue-800">
                The dashboard automatically loads data when you first open it or change workspaces. Use the Refresh button to get updates after deployments have been triggered.
              </p>
            </div>
          </div>
        </section>

        {/* Settings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <p>
              Click the <Settings className="w-4 h-4 inline" /> Settings button in the dashboard header to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Update your Bitbucket OAuth credentials</li>
              <li>Clear saved credentials</li>
              <li>Manage cookie consent preferences</li>
            </ul>
            <p className="mt-4">
              For help setting up OAuth credentials, visit the <button onClick={() => router.push('/help')} className="text-primary hover:underline">OAuth Setup Guide</button>.
            </p>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h3 className="text-lg font-semibold">No Deployments Showing</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ensure the repository has deployment environments configured in Bitbucket</li>
              <li>Check that deployments have been run for the repository</li>
              <li>Try refreshing the data using the Refresh button</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6">Session Expired</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>If you see a session expired message, click &quot;Sign in again&quot;</li>
              <li>You will be redirected to re-authenticate with Bitbucket</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6">OAuth Errors</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Verify your OAuth credentials are correct in Settings</li>
              <li>Ensure your OAuth consumer has the correct permissions (account, repository, pipeline)</li>
              <li>Check that the callback URL is correctly configured in Bitbucket</li>
              <li>Refer to the <button onClick={() => router.push('/help')} className="text-primary hover:underline">OAuth Setup Guide</button> for detailed instructions</li>
            </ul>
          </div>
        </section>

        {/* Data Persistence */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Data Persistence</h2>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <p>
              The dashboard saves your preferences locally in your browser:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Selected Workspace:</strong> Your last selected workspace</li>
              <li><strong>Selected Projects:</strong> Which projects you have chosen to display</li>
              <li><strong>Collapsed Projects:</strong> Which projects are collapsed/expanded</li>
              <li><strong>Repository Visibility:</strong> Which repositories are shown/hidden within each project</li>
              <li><strong>OAuth Credentials:</strong> Stored securely in HTTP-only cookies</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">💡 Note:</p>
              <p className="text-sm text-blue-800">
                Your preferences are stored per workspace, so you can have different project selections for different workspaces.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex gap-4">
            <Button onClick={() => router.push('/help')} variant="outline">
              OAuth Setup Guide
            </Button>
            <Button onClick={() => router.push('/')} variant="default">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
