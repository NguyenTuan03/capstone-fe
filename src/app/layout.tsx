import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import '../styles/vietnamese-classes.css';
import AppAuthProvider from '@/@crema/core/AppAuthProvider';
import AppContextProvider from '@/@crema/context/AppContextProvider';
import viVN from 'antd/locale/vi_VN';
import AppLocaleProvider from '@/@crema/context/AppLocaleProvider';
import AppQueryProvider from '@/@crema/context/AppQueryProvider';
// import AppAuthGuard from '@/@crema/components/AppAuthGuard'; // DISABLED FOR UI DEVELOPMENT
import { App as AntdApp, ConfigProvider } from 'antd';
import AppAuthGuard from '@/@crema/components/AppAuthGuard';
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
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
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AppQueryProvider>
          <ConfigProvider locale={viVN}>
            <AntdApp>
              <AppLocaleProvider>
                <AppContextProvider>
                  <AppAuthProvider>
                    {children}
                    {/* <AppAuthGuard>{children}</AppAuthGuard> DISABLED FOR UI DEVELOPMENT */}
                  </AppAuthProvider>
                </AppContextProvider>
              </AppLocaleProvider>
            </AntdApp>
          </ConfigProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}
