'use client';

import { useEffect } from 'react';
import { Result, Button } from 'antd';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Page
 *
 * This page catches errors in the root layout and above.
 * It's the last resort error boundary for the entire app.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global Error:', error);

    // Log to external service
    // Example: Sentry.captureException(error);
  }, [error]);

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <html>
      <body>
        <div
          style={{
            padding: '50px',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '16px', color: '#ff4d4f' }}>Oops!</h1>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#262626' }}>
              Có lỗi nghiêm trọng xảy ra
            </h2>
            <p style={{ marginBottom: '32px', color: '#8c8c8c', fontSize: '16px' }}>
              Ứng dụng gặp lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                🔄 Thử lại
              </button>

              <button
                onClick={handleReload}
                style={{
                  backgroundColor: '#52c41a',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                🔃 Tải lại trang
              </button>

              <button
                onClick={handleGoHome}
                style={{
                  backgroundColor: '#722ed1',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                🏠 Trang chủ
              </button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && (
              <div
                style={{
                  textAlign: 'left',
                  background: '#fff',
                  padding: '16px',
                  marginTop: '32px',
                  borderRadius: '6px',
                  border: '1px solid #d9d9d9',
                  fontSize: '12px',
                  color: '#666',
                }}
              >
                <strong>Global Error Details:</strong> {error.message}
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
                    maxHeight: '200px',
                    overflow: 'auto',
                  }}
                >
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
