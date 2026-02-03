import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OAuth Settings',
  description: 'Manage your Bitbucket OAuth credentials for the Deployment Dashboard. Update or clear your OAuth client ID and secret securely.',
  openGraph: {
    title: 'OAuth Settings - Bitbucket Deployment Dashboard',
    description: 'Manage your Bitbucket OAuth credentials for the Deployment Dashboard.',
  },
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
