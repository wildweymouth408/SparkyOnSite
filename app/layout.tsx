import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/app-layout';

export const metadata: Metadata = {
  title: 'Sparky - Electrical Calculations',
  description: 'Professional electrical calculations and NEC reference for field electricians',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}