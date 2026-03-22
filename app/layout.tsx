import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'Sparky - Electrician Field Management',
  description: 'Professional electrician field management platform with NEC calculators, job tracking, and code reference. Sparky references NEC 2023 but does not guarantee compliance. Always consult the official NEC and a licensed professional.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f1115',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var field = localStorage.getItem('sparky_field_mode');
              if (field === 'true') document.documentElement.classList.add('field-mode');
              var dark = localStorage.getItem('sparky_dark_mode');
              if (dark === null || dark === 'true') {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {
              document.documentElement.classList.add('dark');
            }
          })();
        `}} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid #333',
              color: '#f0f0f0',
              borderRadius: '0',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}

