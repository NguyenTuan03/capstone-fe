'use client';

import React from 'react';
import { Card, Typography, Row, Col, Statistic, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { MonthlyUserData } from '@/types/statistics';

const { Title, Text } = Typography;

interface UserGrowthChartProps {
  data: MonthlyUserData[];
  title?: string;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({
  data = [],
  title = 'Tăng trưởng người dùng theo tháng',
}) => {
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.learners, item.coaches, item.admins)),
  );

  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const getProgressColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage > 80) return '#52c41a';
    if (percentage > 50) return '#1890ff';
    if (percentage > 20) return '#fa8c16';
    return '#f5222d';
  };

  return (
    <Card title={title} className="h-full">
      <div className="space-y-6">
        {data.slice(-6).map((item, index, array) => {
          const prevItem = index > 0 ? array[index - 1] : item;
          const totalCurrent = item.learners + item.coaches + item.admins;
          const totalPrevious = prevItem.learners + prevItem.coaches + prevItem.admins;
          const growthRate = getGrowthRate(totalCurrent, totalPrevious);

          return (
            <div key={item.month} className="border-b border-gray-100 pb-4 last:border-b-0">
              <Row justify="space-between" align="middle" className="mb-3">
                <Col>
                  <Title level={5} className="mb-0">
                    {item.month}
                  </Title>
                </Col>
                <Col>
                  <Statistic
                    value={growthRate}
                    precision={0}
                    valueStyle={{
                      color: growthRate >= 0 ? '#3f8600' : '#cf1322',
                      fontSize: '14px',
                    }}
                    prefix={growthRate >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    suffix="%"
                  />
                </Col>
              </Row>

              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <Text className="text-xs text-gray-500">Học viên</Text>
                  <Progress
                    percent={Math.round((item.learners / maxValue) * 100)}
                    strokeColor={getProgressColor(item.learners, maxValue)}
                    showInfo={false}
                    size="small"
                  />
                  <Text className="text-xs font-medium">{item.learners}</Text>
                </Col>

                <Col span={8}>
                  <Text className="text-xs text-gray-500">Huấn luyện viên</Text>
                  <Progress
                    percent={Math.round((item.coaches / maxValue) * 100)}
                    strokeColor={getProgressColor(item.coaches, maxValue)}
                    showInfo={false}
                    size="small"
                  />
                  <Text className="text-xs font-medium">{item.coaches}</Text>
                </Col>

                <Col span={8}>
                  <Text className="text-xs text-gray-500">Quản trị</Text>
                  <Progress
                    percent={Math.round((item.admins / maxValue) * 100)}
                    strokeColor={getProgressColor(item.admins, maxValue)}
                    showInfo={false}
                    size="small"
                  />
                  <Text className="text-xs font-medium">{item.admins}</Text>
                </Col>
              </Row>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default UserGrowthChart;
