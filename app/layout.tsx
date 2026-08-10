import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import ConnectionWatcher from '../components/ConnectionWatcher';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${plusJakartaSans.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <body className="bg-[#0D0D0D] text-white font-sans antialiased selection:bg-[#FF5A1F] selection:text-white" suppressHydrationWarning>
        <ConnectionWatcher />
        {children}
      </body>
    </html>
  );
}

