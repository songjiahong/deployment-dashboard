import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Bitbucket Deployment Dashboard using your Bitbucket account. Securely authenticate with OAuth to access your deployment monitoring dashboard.',
  openGraph: {
    title: 'Sign In - Bitbucket Deployment Dashboard',
    description: 'Sign in to access your Bitbucket Deployment Dashboard and monitor your deployments.',
  },
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
