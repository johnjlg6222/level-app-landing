import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Level App | Studio de développement d\'applications mobiles',
  description:
    'Agence de développement d\'applications mobiles. Nous transformons vos idées en applications prêtes à scaler. MVP en 30 jours.',
  keywords: [
    'développement application mobile',
    'agence mobile',
    'react native',
    'mvp',
    'startup',
    'application ios android',
  ],
  authors: [{ name: 'Level App' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://level-app.fr',
    siteName: 'Level App',
    title: 'Level App | Studio de développement d\'applications mobiles',
    description:
      'Agence de développement d\'applications mobiles. MVP en 30 jours.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050507] text-white`}
      >
        {/* Hidden forms for Netlify build-time detection */}
        <form name="calculator-lead" data-netlify="true" hidden>
          <input type="hidden" name="form-name" value="calculator-lead" />
          <input name="name" />
          <input name="email" />
          <input name="phone" />
          <input name="company" />
          <input name="screen_count" />
          <input name="app_type" />
          <input name="auth_level" />
          <input name="payment_needs" />
          <input name="additional_features" />
          <input name="design_style" />
          <input name="has_branding" />
          <input name="estimated_price_min" />
          <input name="estimated_price_max" />
        </form>
        <form name="contact" data-netlify="true" hidden>
          <input type="hidden" name="form-name" value="contact" />
          <input name="name" />
          <input name="email" />
          <input name="project" />
        </form>

        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
