'use client';

import React, { useState, useEffect } from 'react';
import { Card, List, Avatar, Typography, Tag, Button, Space, Tabs, Badge, message } from 'antd';

import {
  UserOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useRouter } from 'next/navigation';
import { PendingApproval, RecentReport } from '@/types/dashboard';
import { DashboardApiService } from '@/services/dashboardApi';

const { Text } = Typography;
const { TabPane } = Tabs;

const PendingItems: React.FC = () => {
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [reports, setReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadPendingItems = async () => {
    setLoading(true);
    try {
      const response = await DashboardApiService.getPendingItems();
      if (response.success) {
        setApprovals(response.data.approvals);
        setReports(response.data.reports);
      }
    } catch {
      message.error('Không thể tải pending items');
    } finally {
      setLoading(false);
    }
  };

  const getApprovalTypeIcon = (type: string) => {
    const iconMap = {
      coach_verification: <UserOutlined style={{ color: '#1890ff' }} />,
      course_approval: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      certificate_review: <CheckCircleOutlined style={{ color: '#722ed1' }} />,
    };
    return iconMap[type as keyof typeof iconMap] || <CheckCircleOutlined />;
  };

  const getReportTypeIcon = (type: string) => {
    const iconMap = {
      user_report: <WarningOutlined style={{ color: '#faad14' }} />,
      coach_report: <WarningOutlined style={{ color: '#ff4d4f' }} />,
      session_issue: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      payment_dispute: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
    };
    return iconMap[type as keyof typeof iconMap] || <WarningOutlined />;
  };

  const handleApprovalClick = (approval: PendingApproval) => {
    router.push(approval.actionUrl);
  };

  const handleReportClick = (report: RecentReport) => {
    router.push(report.actionUrl);
  };

  useEffect(() => {
    loadPendingItems();
  }, []);

  return (
    <Card
      title="Cần xử lý"
      size="small"
      loading={loading}
      extra={
        <Badge
          count={approvals.length + reports.filter((r) => r.status === 'new').length}
          style={{ backgroundColor: '#ff4d4f' }}
        />
      }
    >
      <Tabs size="small" defaultActiveKey="approvals">
        <TabPane
          tab={
            <Badge count={approvals.length} size="small">
              <span>Chờ duyệt</span>
            </Badge>
          }
          key="approvals"
        >
          <List
            size="small"
            dataSource={approvals.slice(0, 5)}
            renderItem={(approval) => (
              <List.Item
                actions={[
                  <Button
                    key="action"
                    type="primary"
                    size="small"
                    onClick={() => handleApprovalClick(approval)}
                  >
                    Xử lý
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={getApprovalTypeIcon(approval.type)}
                  title={
                    <Space>
                      <span style={{ fontSize: '13px' }}>{approval.title}</span>
                      <Tag
                        color={
                          approval.priority === 'high'
                            ? 'red'
                            : approval.priority === 'medium'
                              ? 'orange'
                              : 'blue'
                        }
                      >
                        {approval.priority}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Text style={{ fontSize: '12px' }}>{approval.description}</Text>
                      <br />
                      <Space size="small" style={{ marginTop: '4px' }}>
                        <Avatar src={approval.submittedBy.avatar} icon={<UserOutlined />} />
                        <Text style={{ fontSize: '11px' }}>{approval.submittedBy.name}</Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          • {DashboardApiService.getTimeAgo(approval.submittedAt)}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          • ~{approval.estimatedTime}p
                        </Text>
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          {approvals.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Button type="link" size="small">
                Xem tất cả ({approvals.length})
              </Button>
            </div>
          )}
        </TabPane>

        <TabPane
          tab={
            <Badge count={reports.filter((r) => r.status === 'new').length} size="small">
              <span>Báo cáo</span>
            </Badge>
          }
          key="reports"
        >
          <List
            size="small"
            dataSource={reports.slice(0, 5)}
            renderItem={(report) => (
              <List.Item
                actions={[
                  <Button
                    key="action"
                    type="primary"
                    size="small"
                    danger={report.severity === 'high' || report.severity === 'critical'}
                    onClick={() => handleReportClick(report)}
                  >
                    Xử lý
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={getReportTypeIcon(report.type)}
                  title={
                    <Space>
                      <span style={{ fontSize: '13px' }}>{report.title}</span>
                      <Tag
                        color={
                          report.severity === 'critical'
                            ? 'red'
                            : report.severity === 'high'
                              ? 'orange'
                              : report.severity === 'medium'
                                ? 'blue'
                                : 'default'
                        }
                      >
                        {report.severity}
                      </Tag>
                      <Tag
                        color={
                          report.status === 'new'
                            ? 'red'
                            : report.status === 'investigating'
                              ? 'orange'
                              : 'green'
                        }
                      >
                        {report.status}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Text style={{ fontSize: '12px' }}>{report.description}</Text>
                      <br />
                      <Space size="small" style={{ marginTop: '4px' }}>
                        <Avatar src={report.reportedBy.avatar} icon={<UserOutlined />} />
                        <Text style={{ fontSize: '11px' }}>{report.reportedBy.name}</Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          • {DashboardApiService.getTimeAgo(report.reportedAt)}
                        </Text>
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          {reports.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Button type="link" size="small">
                Xem tất cả ({reports.length})
              </Button>
            </div>
          )}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default PendingItems;
