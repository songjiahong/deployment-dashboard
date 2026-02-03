'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DeploymentDashboard from '@/components/DeploymentDashboard';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

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

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              BB
            </div>
            <div>
              <h1 className="font-semibold">Bitbucket Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, {session.user?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => signOut()} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>
      <main>
        <DeploymentDashboard />
      </main>
    </div>
  );
}
