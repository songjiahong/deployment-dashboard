'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import { saveBitbucketSettings, clearBitbucketSettings, checkBitbucketSettings } from '@/lib/settings';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import CookieConsent from '@/components/CookieConsent';
import { hasConsent } from '@/lib/consent';

export default function SettingsPage() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [hasExistingSettings, setHasExistingSettings] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setConsentGiven(hasConsent());
    checkBitbucketSettings().then(setHasExistingSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!clientId.trim() || !clientSecret.trim()) {
      setError('Both Client ID and Client Secret are required');
      return;
    }

    if (!consentGiven) {
      setShowConsent(true);
      return;
    }

    await saveSettings();
  };

  const saveSettings = async () => {
    const result = await saveBitbucketSettings({
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim(),
    });

    if (result) {
      setSuccess('Settings saved successfully! Please sign in again.');
      setHasExistingSettings(true);
      setTimeout(() => {
        signOut({ callbackUrl: '/auth/signin' });
      }, 2000);
    } else {
      setError('Failed to save settings. Please try again.');
    }
  };

  const handleConsentAccept = () => {
    setConsentGiven(true);
    setShowConsent(false);
    saveSettings();
  };

  const handleConsentReject = () => {
    setShowConsent(false);
    setError('Cookie consent is required to save settings.');
  };

  const handleClearSettings = async () => {
    if (!confirm('Are you sure you want to clear your OAuth credentials? You will need to reconfigure them to use the application.')) {
      return;
    }

    const result = await clearBitbucketSettings();
    if (result) {
      setSuccess('Settings cleared successfully. Redirecting to setup...');
      setTimeout(() => {
        signOut({ callbackUrl: '/auth/signin' });
      }, 1500);
    } else {
      setError('Failed to clear settings.');
    }
  };

  return (
    <>
      {showConsent && (
        <CookieConsent
          onAccept={handleConsentAccept}
          onReject={handleConsentReject}
        />
      )}
      <div className="min-h-screen bg-gray-50">
        <header className="border-b">
          <div className="container mx-auto px-6 py-4">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">OAuth Settings</h1>
          <p className="text-muted-foreground mb-8">
            Manage your Bitbucket OAuth credentials
          </p>

          {hasExistingSettings && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                You have existing OAuth credentials configured. Update them below if needed.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium mb-2">
                Client ID
              </label>
              <input
                id="clientId"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your Bitbucket OAuth Client ID"
              />
            </div>

            <div>
              <label htmlFor="clientSecret" className="block text-sm font-medium mb-2">
                Client Secret
              </label>
              <div className="relative">
                <input
                  id="clientSecret"
                  type={showSecret ? 'text' : 'password'}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  placeholder="Enter your Bitbucket OAuth Client Secret"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 text-sm p-3 rounded-md">
                {success}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 gap-2">
                <Save className="w-4 h-4" />
                Save Settings
              </Button>
              {hasExistingSettings && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleClearSettings}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </form>

          <div className="mt-8 pt-8 border-t">
            <h2 className="text-lg font-semibold mb-4">Important Information</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                • Your OAuth credentials are stored securely in HTTP-only cookies
              </p>
              <p>
                • Updating credentials will require you to sign in again
              </p>
              <p>
                • Clearing credentials will remove all stored settings and sign you out
              </p>
              <p>
                • Visit the <button onClick={() => router.push('/help')} className="text-primary hover:underline">Help page</button> for instructions on creating OAuth credentials
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
