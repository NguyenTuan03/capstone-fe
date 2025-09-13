import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppAuthProvider from '@/@crema/core/AppAuthProvider';
import AppContextProvider from '@/@crema/context/AppContextProvider';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import AppLocaleProvider from '@/@crema/context/AppLocaleProvider';
import AppQueryProvider from '@/@crema/context/AppQueryProvider';
import AppAuthGuard from '@/@crema/components/AppAuthGuard';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-google-analytics-opt-out="" cz-shortcut-listen="true">
      <body
        cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppQueryProvider>
          <ConfigProvider locale={viVN}>
            <AppLocaleProvider>
              <AppContextProvider>
                <AppAuthProvider>
                  <AppAuthGuard>{children}</AppAuthGuard>
                </AppAuthProvider>
              </AppContextProvider>
            </AppLocaleProvider>
          </ConfigProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}
