'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Upload,
  Progress,
  List,
  Avatar,
  Tag,
  Space,
} from 'antd';
import {
  UploadOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const AIPage = () => {
  const [uploading, setUploading] = useState(false);

  const analysisHistory = [
    {
      id: 1,
      title: 'Phân tích kỹ thuật serve - Video 1',
      date: '2024-01-20',
      status: 'Hoàn thành',
      score: 85,
      feedback: 'Kỹ thuật serve tốt, cần cải thiện độ chính xác',
      duration: '2:30',
      fileSize: '15.2 MB',
    },
    {
      id: 2,
      title: 'Phân tích chiến thuật đôi - Video 2',
      date: '2024-01-18',
      status: 'Hoàn thành',
      score: 92,
      feedback: 'Phối hợp tốt, cần tăng cường giao tiếp',
      duration: '3:45',
      fileSize: '22.1 MB',
    },
    {
      id: 3,
      title: 'Phân tích kỹ thuật volley - Video 3',
      date: '2024-01-15',
      status: 'Đang xử lý',
      score: null,
      feedback: null,
      duration: '1:50',
      fileSize: '12.8 MB',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'success';
      case 'Đang xử lý':
        return 'processing';
      case 'Lỗi':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return <CheckCircleOutlined />;
      case 'Đang xử lý':
        return <ClockCircleOutlined />;
      case 'Lỗi':
        return <RobotOutlined />;
      default:
        return <PlayCircleOutlined />;
    }
  };

  const handleUpload = (file: any) => {
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
    }, 2000);
    return false; // Prevent default upload
  };

  return (
    <div>
      <Title level={2}>AI Phân tích kỹ thuật</Title>

      {/* Upload Section */}
      <Card title="Tải lên video để phân tích" style={{ marginBottom: 24 }}>
        <Dragger
          name="file"
          multiple={false}
          accept="video/*"
          beforeUpload={handleUpload}
          disabled={uploading}
          style={{ padding: '40px 0' }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">Nhấp hoặc kéo thả video vào đây</p>
          <p className="ant-upload-hint">
            Hỗ trợ định dạng: MP4, AVI, MOV. Kích thước tối đa: 100MB
          </p>
        </Dragger>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            icon={<UploadOutlined />}
            loading={uploading}
            disabled={uploading}
          >
            {uploading ? 'Đang tải lên...' : 'Bắt đầu phân tích'}
          </Button>
        </div>
      </Card>

      {/* Analysis History */}
      <Card title="Lịch sử phân tích">
        <List
          dataSource={analysisHistory}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key={item.id} type="link" icon={<EyeOutlined />}>
                  Xem chi tiết
                </Button>,
                item.status === 'Hoàn thành' && (
                  <Button key={item.id} type="link" icon={<DownloadOutlined />}>
                    Tải báo cáo
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={getStatusIcon(item.status)}
                    style={{
                      backgroundColor:
                        item.status === 'Hoàn thành'
                          ? '#52c41a'
                          : item.status === 'Đang xử lý'
                            ? '#1890ff'
                            : '#ff4d4f',
                    }}
                  />
                }
                title={item.title}
                description={
                  <div>
                    <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text type="secondary">Ngày: {item.date}</Text>
                      <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                      <Text type="secondary">• {item.duration}</Text>
                      <Text type="secondary">• {item.fileSize}</Text>
                    </div>
                    {item.status === 'Hoàn thành' && (
                      <div>
                        <div style={{ marginBottom: 4 }}>
                          <Text strong>Điểm số: {item.score}/100</Text>
                        </div>
                        <div>
                          <Text type="secondary">{item.feedback}</Text>
                        </div>
                      </div>
                    )}
                    {item.status === 'Đang xử lý' && (
                      <div>
                        <Text type="secondary">Đang phân tích video...</Text>
                        <Progress percent={65} size="small" style={{ marginTop: 4 }} />
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* AI Features */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Phân tích kỹ thuật" size="small">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <PlayCircleOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
              <div>Phân tích chuyển động và kỹ thuật</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Đánh giá hiệu suất" size="small">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <EyeOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }} />
              <div>Đánh giá và gợi ý cải thiện</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Báo cáo chi tiết" size="small">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <FileTextOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 8 }} />
              <div>Xuất báo cáo phân tích</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>12</div>
              <div style={{ color: '#666' }}>Video đã phân tích</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>87</div>
              <div style={{ color: '#666' }}>Điểm trung bình</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>5</div>
              <div style={{ color: '#666' }}>Báo cáo đã tải</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AIPage;
