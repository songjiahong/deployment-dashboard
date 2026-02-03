const CONSENT_COOKIE = 'cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

export function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  
  const consent = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${CONSENT_COOKIE}=`));
  
  return consent?.split('=')[1] === 'accepted';
}

export function setConsent(accepted: boolean): void {
  if (typeof window === 'undefined') return;
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);
  
  document.cookie = `${CONSENT_COOKIE}=${accepted ? 'accepted' : 'rejected'}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}

export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${CONSENT_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
