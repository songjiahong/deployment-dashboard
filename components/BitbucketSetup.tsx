'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Eye, EyeOff, Book, LayoutDashboard } from 'lucide-react';
import { saveBitbucketSettings } from '@/lib/settings';
import { useRouter } from 'next/navigation';
import CookieConsent from '@/components/CookieConsent';
import { hasConsent } from '@/lib/consent';

export default function BitbucketSetup() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState('');
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setConsentGiven(hasConsent());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
    const success = await saveBitbucketSettings({
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim(),
    });

    if (success) {
      window.location.reload();
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
    setError('Cookie consent is required to use this application.');
  };

  return (
    <>
      {showConsent && (
        <CookieConsent
          onAccept={handleConsentAccept}
          onReject={handleConsentReject}
        />
      )}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <LayoutDashboard className="w-10 h-10" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Bitbucket OAuth Setup</h1>
          <p className="text-muted-foreground text-center mb-6">
            Configure your Bitbucket OAuth credentials to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button type="submit" className="w-full">
              Save Configuration
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t space-y-2">
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
              How to create OAuth credentials?
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Your credentials are stored securely in your browser&apos;s cookies</p>
        </div>
      </div>
    </div>
    </>
  );
}
