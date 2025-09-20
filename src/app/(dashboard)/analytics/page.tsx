'use client';

import { Typography } from 'antd';
import IntlMessages from '@/@crema/helper/IntlMessages';

const { Title, Text } = Typography;

export default function AnalyticsPage() {
  return (
    <div>
      <Title level={2}>
        <IntlMessages id="page.analytics.title" />
      </Title>
      <Text className="text-gray-600">
        <IntlMessages id="page.analytics.subtitle" />
      </Text>
    </div>
  );
}
