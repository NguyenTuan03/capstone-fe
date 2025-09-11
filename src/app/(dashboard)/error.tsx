'use client';

import { useEffect } from 'react';
import { Result, Button } from 'antd';
import { HomeOutlined, ReloadOutlined, DashboardOutlined } from '@ant-design/icons';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Dashboard Error Page
 *
 * Specific error handling for dashboard section
 */
export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div
      style={{
        padding: '50px',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Result
        status="error"
        title="Lỗi Dashboard"
        subTitle="Có lỗi xảy ra trong dashboard. Vui lòng thử lại hoặc liên hệ hỗ trợ."
        extra={[
          <Button type="primary" key="reset" icon={<ReloadOutlined />} onClick={reset}>
            Thử lại
          </Button>,
          <Button key="dashboard" icon={<DashboardOutlined />} onClick={handleGoDashboard}>
            Dashboard
          </Button>,
          <Button key="home" icon={<HomeOutlined />} onClick={handleGoHome}>
            Trang chủ
          </Button>,
        ]}
      >
        {process.env.NODE_ENV === 'development' && (
          <div
            style={{
              textAlign: 'left',
              background: '#fff',
              padding: '16px',
              marginTop: '16px',
              borderRadius: '6px',
              border: '1px solid #d9d9d9',
              fontSize: '12px',
              color: '#666',
            }}
          >
            <strong>Dashboard Error:</strong> {error.message}
            {error.digest && (
              <>
                <br />
                <strong>Digest:</strong> {error.digest}
              </>
            )}
          </div>
        )}
      </Result>
    </div>
  );
}
