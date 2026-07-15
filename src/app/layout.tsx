import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'GitVerse — Explore Repositories as Planets',
    template: '%s | GitVerse',
  },
  description:
    'GitVerse transforms GitHub repositories into interactive planets inside a beautiful universe. Explore code like never before.',
  keywords: [
    'github',
    'visualization',
    'repositories',
    'planets',
    '3D',
    'open source',
  ],
  authors: [{ name: 'GitVerse' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'GitVerse',
    title: 'GitVerse — Explore Repositories as Planets',
    description:
      'GitVerse transforms GitHub repositories into interactive planets inside a beautiful universe.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitVerse — Explore Repositories as Planets',
    description:
      'GitVerse transforms GitHub repositories into interactive planets inside a beautiful universe.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
