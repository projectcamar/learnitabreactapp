'use client'

import './globals.css'
import type { Metadata } from 'next'
import { ErrorBoundary } from 'react-error-boundary';
import dynamic from 'next/dynamic';

const Error = dynamic(() => import('./error'), { 
  ssr: true,
  loading: () => <div>Loading...</div>
});

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
    <html lang="en">
      <body>
        <ErrorBoundary fallback={
          <Error 
            error={{ message: "Something went wrong" }}
            reset={() => window.location.reload()}
          />
        }>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
