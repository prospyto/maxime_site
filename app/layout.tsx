import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import ConnectionWatcher from '../components/ConnectionWatcher';
import InitialLoader from '../components/InitialLoader';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Ember Sushi | L'art du sushi, réinventé",
  description: "Découvrez Ember Sushi : une expérience culinaire japonaise moderne et authentique. Plats d'exception, produits ultra frais, ambiance raffinée.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${plusJakartaSans.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <body className="bg-[#0D0D0D] text-white font-sans antialiased selection:bg-[#FF5A1F] selection:text-white" suppressHydrationWarning>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M4C6KTXEP5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M4C6KTXEP5');
          `}
        </Script>
        <InitialLoader />
        <ConnectionWatcher />
        {children}
      </body>
    </html>
  );
}

