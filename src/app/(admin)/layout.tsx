'use client';

import React from 'react';
import { Layout } from 'antd';
import Header from '@/modules/auth/header';
import AdminTabs from '@/components/admin/AdminTabs';

const { Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header />
      <Content className="bg-gray-50 p-8 pt-6">
        {/* Stats Cards - động dựa trên route */}
        {/* <AdminHeader /> */}

        {/* Tab Navigation */}
        <AdminTabs />

        {/* Page Content */}
        <div className="mt-6">{children}</div>
      </Content>
    </Layout>
  );
}

/*
// AUTHENTICATION DISABLED FOR UI DEVELOPMENT
// TO ENABLE: Uncomment the auth logic below and comment out current layout

'use client';

import AppLoader from '@/@crema/components/AppLoader';
import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';
import Header from '@/modules/auth/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useJWTAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AppLoader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
*/
