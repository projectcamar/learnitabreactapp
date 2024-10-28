import './globals.css'
import type { Metadata } from 'next'
import { ErrorBoundary } from 'react-error-boundary';
import Error from './error';

export const metadata: Metadata = {
  title: 'Learnitab',
  description: 'Find opportunities for internships, competitions, scholarships, and mentorship',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ErrorBoundary FallbackComponent={Error}>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
