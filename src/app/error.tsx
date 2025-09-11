'use client';

import { useEffect } from 'react';
import { Result, Button } from 'antd';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js Error Page
 *
 * This page is shown when an error occurs at the route level:
 * - Server errors
 * - Async component errors
 * - Route navigation errors
 * - Layout/Page component errors
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error for debugging
    console.error('Route Error:', error);

    // You can also log to external service here
    // Example: Sentry.captureException(error);
  }, [error]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const getErrorMessage = () => {
    if (error.message.includes('ChunkLoadError')) {
      return 'Có lỗi tải trang. Vui lòng thử lại.';
    }
    if (error.message.includes('NetworkError')) {
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
    }
    if (error.message.includes('404')) {
      return 'Không tìm thấy trang yêu cầu.';
    }
    return 'Đã xảy ra lỗi không mong muốn.';
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
        title="Oops! Có lỗi xảy ra"
        subTitle={getErrorMessage()}
        extra={[
          <Button type="primary" key="reset" icon={<ReloadOutlined />} onClick={reset}>
            Thử lại
          </Button>,
          <Button key="home" icon={<HomeOutlined />} onClick={handleGoHome}>
            Về trang chủ
          </Button>,
        ]}
      >
        {/* Show error details in development */}
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
            <strong>Error Details:</strong> {error.message}
            {error.digest && (
              <>
                <br />
                <strong>Digest:</strong> {error.digest}
              </>
            )}
            <br />
            <strong>Stack:</strong>
            <pre
              style={{
                fontSize: '11px',
                marginTop: '8px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {error.stack}
            </pre>
          </div>
        )}
      </Result>
    </div>
  );
}
