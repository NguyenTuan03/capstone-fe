'use client';

import { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import IntlMessages from '@/@crema/helper/IntlMessages';

const { Title, Text } = Typography;

export default function AnalyticsPageClient() {
  return (
    <div className="space-y-6">
      <div>
        <Title level={2}>
          <IntlMessages id="analytics.title" />
        </Title>
        <Text className="text-gray-600">
          <IntlMessages id="analytics.subtitle" />
        </Text>
      </div>

      <Card>
        <Text>Analytics page will be implemented here</Text>
      </Card>
    </div>
  );
}
