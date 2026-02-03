'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { hasConsent, setConsent } from '@/lib/consent';

interface CookieConsentProps {
  onAccept: () => void;
  onReject?: () => void;
}

export default function CookieConsent({ onAccept, onReject }: CookieConsentProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!hasConsent());
  }, []);

  const handleAccept = () => {
    setConsent(true);
    setShow(false);
    onAccept();
  };

  const handleReject = () => {
    setConsent(false);
    setShow(false);
    if (onReject) {
      onReject();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Cookie className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Cookie Consent</h2>
            
            <div className="text-sm text-muted-foreground space-y-3 mb-6">
              <p>
                This application uses cookies to provide essential functionality. We respect your privacy and comply with GDPR regulations.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-semibold text-foreground mb-2">Cookies We Use:</h3>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <strong className="text-foreground">Authentication Cookies:</strong> Required for user authentication and session management (NextAuth.js)
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <strong className="text-foreground">OAuth Configuration Cookie:</strong> Stores your Bitbucket OAuth credentials (Client ID and Client Secret) securely in an HTTP-only cookie
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <div>
                      <strong className="text-foreground">Consent Cookie:</strong> Remembers your cookie consent preference
                    </div>
                  </li>
                </ul>
              </div>

              <p className="text-xs">
                <strong>Data Storage:</strong> All cookies are stored locally in your browser and are not shared with third parties. 
                Your OAuth credentials are encrypted and stored in HTTP-only cookies for security.
              </p>

              <p className="text-xs">
                <strong>Your Rights:</strong> You can withdraw consent at any time by clearing your browser cookies. 
                This will require you to reconfigure the application.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAccept} className="flex-1">
                Accept & Continue
              </Button>
              <Button onClick={handleReject} variant="outline" className="flex-1">
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
