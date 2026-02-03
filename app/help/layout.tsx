import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OAuth Setup Guide',
  description: 'Step-by-step guide to setting up Bitbucket OAuth credentials for the Deployment Dashboard. Learn how to create OAuth consumers, configure permissions, and integrate with your dashboard.',
  openGraph: {
    title: 'OAuth Setup Guide - Bitbucket Deployment Dashboard',
    description: 'Step-by-step guide to setting up Bitbucket OAuth credentials for the Deployment Dashboard.',
  },
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
