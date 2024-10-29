import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from './components/ClientLayout'

export const metadata: Metadata = {
  title: 'Learnitab',
  description: 'Find opportunities for internships, competitions, scholarships, and mentorship',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
