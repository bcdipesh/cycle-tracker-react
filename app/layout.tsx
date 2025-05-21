import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cycle Tracker',
  description: 'A simple cycle tracker app',
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="p-4">
          <h1 className="text-center text-2xl font-bold">Cycle Tracker</h1>
        </header>

        <main className="mx-auto mt-4 flex max-w-xl flex-col gap-4 p-4">
          {children}
        </main>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
