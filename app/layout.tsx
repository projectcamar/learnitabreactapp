import './globals.css'
import type { Metadata } from 'next'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Error from './error';

export const metadata: Metadata = {
  title: 'Learnitab',
  description: 'Find opportunities for internships, competitions, scholarships, and mentorship',
}

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <Error error={error} reset={resetErrorBoundary} />
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <main>{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  )
}
