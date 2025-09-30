'use client';
import React, { useState } from 'react';
import { Button, Dropdown } from 'antd';
import {
  ArrowLeftOutlined,
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';

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
      <div className="px-6 py-0">
        <div className="flex justify-between items-center h-12">
          {/* Left side - Title only */}
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-800 mb-0">Admin Dashboard</h1>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center space-x-2">
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
                size="small"
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
              size="small"
            />

            {/* Settings - Main settings button */}
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={handleSettings}
              className="text-gray-600 hover:text-gray-900 border-0"
              size="small"
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
