import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import '../styles/vietnamese-classes.css';
import AppAuthProvider from '@/@crema/core/AppAuthProvider';
import AppContextProvider from '@/@crema/context/AppContextProvider';
import viVN from 'antd/locale/vi_VN';
import AppLocaleProvider from '@/@crema/context/AppLocaleProvider';
import AppQueryProvider from '@/@crema/context/AppQueryProvider';
import { App as AntdApp, ConfigProvider } from 'antd';
import { Toaster } from 'react-hot-toast';
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
                  <AppAuthProvider>{children}</AppAuthProvider>
                </AppContextProvider>
              </AppLocaleProvider>
            </AntdApp>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  padding: 0,
                  background: 'transparent',
                  boxShadow: 'none',
                },
                success: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
              containerStyle={{
                top: 20,
              }}
            />
          </ConfigProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}
