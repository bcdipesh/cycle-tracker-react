import { Geist, Geist_Mono } from 'next/font/google';

import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

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
  title: 'Period Cycle Tracker',
  description: 'A simple period cycle tracking application',
  authors: [
    {
      name: 'Dipesh B C',
      url: 'https://www.dipeshbc.com',
    },
  ],
  keywords: [
    'cycle tracker',
    'menstrual cycle',
    'period tracker',
    'health',
    'wellness',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          borderRadius: '1rem',
          colorPrimary: '#ff2056',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 p-4 antialiased dark:from-rose-950 dark:via-gray-950 dark:to-gray-950`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
