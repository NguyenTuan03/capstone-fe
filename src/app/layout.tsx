import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppAuthProvider from '@/@crema/core/AppAuthProvider';
import AppContextProvider from '@/@crema/context/AppContextProvider';
import { buildMetadata } from '@/@crema/helper/seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = buildMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-google-analytics-opt-out="" cz-shortcut-listen="true">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppContextProvider>
          <AppAuthProvider>{children}</AppAuthProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
