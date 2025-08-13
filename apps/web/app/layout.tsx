import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'EduPlatform - Learn Without Limits',
    template: '%s | EduPlatform',
  },
  description: 'Comprehensive online learning platform with expert-led courses',
  keywords: ['education', 'online learning', 'courses', 'skills'],
  authors: [{ name: 'EduPlatform Team' }],
  creator: 'EduPlatform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eduplatform.com',
    title: 'EduPlatform - Learn Without Limits',
    description: 'Comprehensive online learning platform with expert-led courses',
    siteName: 'EduPlatform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduPlatform - Learn Without Limits',
    description: 'Comprehensive online learning platform with expert-led courses',
    creator: '@eduplatform',
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`min-h-screen bg-background font-sans antialiased ${inter.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}