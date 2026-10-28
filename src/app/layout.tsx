import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4f46e5',
};

export const metadata: Metadata = {
  title: 'SmartStation — Everything You Need to Write, Create & Organize',
  description:
    'Premium stationery marketplace for students, artists, and professionals. Shop notebooks, pens, art supplies, desk accessories, and custom stationery kits.',
  keywords: [
    'stationery',
    'pens',
    'notebooks',
    'journals',
    'office supplies',
    'school supplies',
    'art materials',
    'SmartStation',
    'stationery kit',
  ],
  authors: [{ name: 'SmartStation Commerce' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✏️</text></svg>"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
