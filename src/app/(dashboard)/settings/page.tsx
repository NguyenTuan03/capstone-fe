'use client';

import { ProfileSettings } from '@/components/settings/profile-settings';
import { SecuritySettings } from '@/components/settings/security-settings';
import { NotificationSettings } from '@/components/settings/notification-settings';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
        <p className="mt-1 text-sm text-gray-600">
          Quản lý thông tin cá nhân và cài đặt tài khoản
        </p>
      </div>

      <div className="space-y-8">
        <ProfileSettings />
        <SecuritySettings />
        <NotificationSettings />
      </div>
    </div>
  );
}