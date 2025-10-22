'use client';

import React, { useState } from 'react';
import { Layout, Menu, Typography, ConfigProvider } from 'antd';
import { VideoCameraOutlined, CompressOutlined, TrophyOutlined } from '@ant-design/icons';
import VideoAnalysis from '@/modules/learner/ai/VideoAnalysis';
import VideoComparator from '@/modules/learner/ai/VideoComparator';

const { Header, Content } = Layout;
const { Title } = Typography;

enum AnalysisType {
  VideoAnalysis = 'Phân tích Video',
  VideoComparator = 'So sánh Video',
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalysisType>(AnalysisType.VideoAnalysis);

  const menuItems = [
    {
      key: AnalysisType.VideoAnalysis,
      icon: <VideoCameraOutlined />,
      label: AnalysisType.VideoAnalysis,
    },
    {
      key: AnalysisType.VideoComparator,
      icon: <CompressOutlined />,
      label: AnalysisType.VideoComparator,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case AnalysisType.VideoAnalysis:
        return <VideoAnalysis />;
      case AnalysisType.VideoComparator:
        return <VideoComparator />;
      default:
        return <VideoAnalysis />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#13c2c2',
          colorBgContainer: '#1a1f3a',
          colorBgElevated: '#1a1f3a',
          colorBorder: '#2a2f4a',
          colorText: '#ffffff',
          colorTextSecondary: '#8c8fa5',
        },
        components: {
          Menu: {
            itemSelectedBg: 'transparent',
            itemSelectedColor: '#13c2c2',
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#0a0e27' }}>
        <Header
          style={{
            background: '#1a1f3a',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            padding: 0,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <TrophyOutlined style={{ fontSize: 32, color: '#13c2c2' }} />
            <Title
              level={2}
              style={{
                margin: 0,
                color: '#ffffff',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              Pickleball AI Coach
            </Title>
          </div>
        </Header>

        <Layout>
          <Content
            style={{
              background: '#0a0e27',
              padding: 24,
              maxWidth: 1400,
              margin: '0 auto',
              width: '100%',
            }}
          >
            <Menu
              mode="horizontal"
              selectedKeys={[activeTab]}
              items={menuItems}
              onClick={({ key }) => setActiveTab(key as AnalysisType)}
              style={{
                background: 'transparent',
                borderBottom: '1px solid #2a2f4a',
                marginBottom: 32,
                justifyContent: 'center',
              }}
              theme="dark"
            />

            <div style={{ padding: '0 16px' }}>{renderContent()}</div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
