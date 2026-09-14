import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atmos Weather - Premium Weather Forecast',
  description: 'Experience immersive 3D weather forecasting with cinematic visuals and real-time climate intelligence.',
  keywords: 'weather, forecast, 3D, climate, atmospheric, interactive',
  authors: [{ name: 'Atmos Weather' }],
  creator: 'Atmos Weather',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://atmos-weather.app',
    siteName: 'Atmos Weather',
    title: 'Atmos Weather - Premium Weather Forecast',
    description: 'Experience immersive 3D weather forecasting with cinematic visuals.',
    images: [
      {
        url: 'https://atmos-weather.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Atmos Weather',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atmos Weather',
    description: 'Premium 3D weather forecasting experience',
    images: ['https://atmos-weather.app/twitter-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
