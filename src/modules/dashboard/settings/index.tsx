'use client';

import { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import IntlMessages from '@/@crema/helper/IntlMessages';

const { Title, Text } = Typography;

export default function SettingsPageClient() {
  return (
    <div className="space-y-6">
      <div>
        <Title level={2}>
          <IntlMessages id="settings.title" />
        </Title>
        <Text className="text-gray-600">
          <IntlMessages id="settings.subtitle" />
        </Text>
      </div>

      <Card>
        <Text>Settings page will be implemented here</Text>
      </Card>
    </div>
  );
}
