import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Bitbucket Deployment Dashboard - Monitor & Manage Deployments',
    template: '%s | Bitbucket Deployment Dashboard'
  },
  description: 'Comprehensive deployment monitoring dashboard for Bitbucket. Track deployments across multiple environments, manage projects and repositories, and streamline your CI/CD workflow with real-time status updates.',
  keywords: ['bitbucket', 'deployment', 'dashboard', 'ci/cd', 'devops', 'pipeline', 'monitoring', 'bitbucket pipelines', 'deployment tracking', 'continuous deployment'],
  authors: [{ name: 'Bitbucket Deployment Dashboard' }],
  creator: 'Bitbucket Deployment Dashboard',
  publisher: 'Bitbucket Deployment Dashboard',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://deployment-dashboard.hexagonprofile.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Bitbucket Deployment Dashboard - Monitor & Manage Deployments',
    description: 'Comprehensive deployment monitoring dashboard for Bitbucket. Track deployments across multiple environments, manage projects and repositories, and streamline your CI/CD workflow.',
    siteName: 'Bitbucket Deployment Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bitbucket Deployment Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitbucket Deployment Dashboard - Monitor & Manage Deployments',
    description: 'Comprehensive deployment monitoring dashboard for Bitbucket. Track deployments across multiple environments and streamline your CI/CD workflow.',
    images: ['/og-image.png'],
    creator: '@bitbucket',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bitbucket Deployment Dashboard',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description: 'Comprehensive deployment monitoring dashboard for Bitbucket. Track deployments across multiple environments, manage projects and repositories, and streamline your CI/CD workflow.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
