'use client';
import { Result, Button } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useIntl } from 'react-intl';

/**
 * 404 Not Found Page
 *
 * This page is shown when a route doesn't exist
 */
export default function NotFound() {
  const { messages: t } = useIntl();
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
        status="404"
        title="404"
        subTitle={t['common.notFound'] as string}
        extra={[
          <Link href="/" key="home">
            <Button type="primary" icon={<HomeOutlined />}>
              {t['common.backToHome'] as string}
            </Button>
          </Link>,
          <Link href="/dashboard" key="dashboard">
            <Button icon={<SearchOutlined />}>{t['common.search'] as string}</Button>
          </Link>,
        ]}
      />
    </div>
  );
}
