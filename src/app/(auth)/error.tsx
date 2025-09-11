'use client';

import { useEffect } from 'react';
import { Result, Button } from 'antd';
import { HomeOutlined, ReloadOutlined, LoginOutlined } from '@ant-design/icons';

interface AuthErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Auth Error Page
 *
 * Specific error handling for authentication section
 */
export default function AuthError({ error, reset }: AuthErrorProps) {
  useEffect(() => {
    console.error('Auth Error:', error);
  }, [error]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoSignIn = () => {
    window.location.href = '/signin';
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
        title="Lỗi Đăng Nhập"
        subTitle="Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại."
        extra={[
          <Button type="primary" key="reset" icon={<ReloadOutlined />} onClick={reset}>
            Thử lại
          </Button>,
          <Button key="signin" icon={<LoginOutlined />} onClick={handleGoSignIn}>
            Đăng nhập
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
            <strong>Auth Error:</strong> {error.message}
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
