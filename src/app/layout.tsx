import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI MovieMaker',
  description: 'Generate cinematic scenes and full-length narratives with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OnboardingProvider>
          {children}
        </OnboardingProvider>
      </body>
    </html>
  );
}
