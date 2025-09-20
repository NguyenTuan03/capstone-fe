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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo + Back button */}
          <div className="flex items-center space-x-3">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900"
            />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PB</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">
                Pickleball Learning
              </span>
            </div>
          </div>

          {/* Right side - 3 buttons */}
          <div className="flex items-center space-x-2">
            {/* Language button (outermost) */}
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
                className="text-gray-600 hover:text-gray-900"
              >
                {currentLanguage === 'vi' ? '🇻🇳' : '🇺🇸'}
              </Button>
            </Dropdown>

            {/* Theme toggle button (middle) */}
            <Button
              type="text"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={handleToggleTheme}
              className="text-gray-600 hover:text-gray-900"
            />

            {/* Settings button (innermost) */}
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={handleSettings}
              className="text-gray-600 hover:text-gray-900"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
