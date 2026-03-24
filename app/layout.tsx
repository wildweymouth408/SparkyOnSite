import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Sparky - Electrical Calculations',
  description: 'Professional electrical calculations and NEC reference for field electricians',
  generator: 'Next.js',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0e27" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
