import './globals.css'
import type { Metadata } from 'next'

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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
