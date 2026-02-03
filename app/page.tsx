'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DeploymentDashboard from '@/components/DeploymentDashboard';
import BitbucketSetup from '@/components/BitbucketSetup';
import CookieConsent from '@/components/CookieConsent';
import { Button } from '@/components/ui/button';
import { LogOut, HelpCircle, Settings, Book, LayoutDashboard } from 'lucide-react';
import { checkBitbucketSettings } from '@/lib/settings';
import { hasConsent } from '@/lib/consent';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [hasSettings, setHasSettings] = useState<boolean | null>(null);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    checkBitbucketSettings().then(setHasSettings);
  }, []);

  useEffect(() => {
    if (hasSettings && !hasConsent()) {
      setShowConsent(true);
    }
  }, [hasSettings]);

  useEffect(() => {
    // If loading takes more than 3 seconds, redirect to sign-in
    if (status === 'loading') {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
        router.push('/auth/signin');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  if (status === 'loading' && !loadingTimeout) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (hasSettings === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking configuration...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <>
      {showConsent && (
        <CookieConsent
          onAccept={() => setShowConsent(false)}
          onReject={() => {
            setShowConsent(false);
            signOut();
          }}
        />
      )}
      <div className="min-h-screen bg-gray-50">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-semibold">Bitbucket Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, {session.user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push('/help/manual')} className="gap-2">
              <Book className="w-4 h-4" />
              Manual
            </Button>
            <Button variant="ghost" onClick={() => router.push('/settings')} className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="ghost" onClick={() => router.push('/help')} className="gap-2">
              <HelpCircle className="w-4 h-4" />
              Help
            </Button>
            <Button variant="outline" onClick={() => signOut()} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main>
        <DeploymentDashboard />
      </main>
    </div>
    </>
  );
}
