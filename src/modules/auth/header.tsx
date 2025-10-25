'use client';
import React, { useState } from 'react';
import { Button, Dropdown, Typography } from 'antd';
import {
  ArrowLeftOutlined,
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';

const { Text } = Typography;

const Header = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('vi');

  const handleBack = () => {
    router.back();
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement theme toggle logic
    console.log('Toggle theme:', !isDarkMode ? 'dark' : 'light');
  };

  const languageMenuItems: MenuProps['items'] = [
    {
      key: 'vi',
      label: '🇻🇳 Tiếng Việt',
    },
    {
      key: 'en',
      label: '🇺🇸 English',
    },
  ];

  const handleLanguageChange = ({ key }: { key: string }) => {
    setCurrentLanguage(key);
    // TODO: Implement language change logic
    console.log('Change language to:', key);
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <header
      className="bg-white border-b border-gray-200"
      style={{ boxShadow: 'none', borderRight: 'none' }}
    >
      <div className="px-8 py-0">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo, Title and subtitle */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">PL</span>
            </div>
            
            {/* Title and subtitle */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-800 mb-0">PICKLE-LEARN Admin</h1>
              <Text className="text-sm text-gray-600">
                Quản lý nền tảng học Pickleball và kết nối huấn luyện viên
              </Text>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Language selector */}
            <Dropdown
              menu={{
                items: languageMenuItems,
                onClick: handleLanguageChange,
              }}
              placement="bottomRight"
              arrow
            >
              <Button
                type="text"
                icon={<GlobalOutlined />}
                className="text-gray-600 hover:text-gray-900 border-0"
                size="middle"
              >
                {currentLanguage === 'vi' ? 'VN' : 'EN'}
              </Button>
            </Dropdown>

            {/* Theme toggle */}
            <Button
              type="text"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={handleToggleTheme}
              className="text-gray-600 hover:text-gray-900 border-0"
              size="middle"
            />

            {/* Settings */}
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={handleSettings}
              className="text-gray-600 hover:text-gray-900 border-0"
              size="middle"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
