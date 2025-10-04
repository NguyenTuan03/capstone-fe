'use client';

import { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

export default function SettingsPageClient() {
  return (
    <div className="space-y-6">
      <div>
        <Title level={2}>Cài đặt hệ thống</Title>
        <Text className="text-gray-600">Quản lý các cài đặt và cấu hình hệ thống</Text>
      </div>

      <Card>
        <Text>Settings page will be implemented here</Text>
      </Card>
    </div>
  );
}
