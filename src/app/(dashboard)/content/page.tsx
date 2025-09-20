'use client';

import { Typography } from 'antd';
import IntlMessages from '@/@crema/helper/IntlMessages';

const { Title, Text } = Typography;

export default function ContentPage() {
  return (
    <div>
      <Title level={2}>
        <IntlMessages id="page.content.title" />
      </Title>
      <Text className="text-gray-600">
        <IntlMessages id="page.content.subtitle" />
      </Text>
    </div>
  );
}
