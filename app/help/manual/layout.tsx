import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard User Manual',
  description: 'Complete user manual for the Bitbucket Deployment Dashboard. Learn how to manage workspaces, projects, repositories, monitor deployments, understand status indicators, and troubleshoot common issues.',
  openGraph: {
    title: 'Dashboard User Manual - Bitbucket Deployment Dashboard',
    description: 'Complete user manual for the Bitbucket Deployment Dashboard. Learn how to manage workspaces, projects, and monitor deployments effectively.',
  },
}

export default function ManualLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
