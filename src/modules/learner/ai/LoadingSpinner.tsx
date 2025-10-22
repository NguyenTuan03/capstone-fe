import React from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const LoadingSpinner: React.FC = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48, color: '#13c2c2' }} spin />;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
      }}
    >
      <Spin indicator={antIcon} />
      <Text style={{ marginTop: 24, color: '#8c8fa5', fontSize: 14 }}>
        AI Coach đang phân tích video của bạn...
      </Text>
    </div>
  );
};

export default LoadingSpinner;
