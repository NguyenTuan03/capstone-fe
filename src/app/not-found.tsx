import { Result, Button } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

/**
 * 404 Not Found Page
 *
 * This page is shown when a route doesn't exist
 */
export default function NotFound() {
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
        subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
        extra={[
          <Link href="/" key="home">
            <Button type="primary" icon={<HomeOutlined />}>
              Về trang chủ
            </Button>
          </Link>,
          <Link href="/dashboard" key="dashboard">
            <Button icon={<SearchOutlined />}>Tìm kiếm</Button>
          </Link>,
        ]}
      />
    </div>
  );
}
