'use client';

import AppLoader from '@/@crema/components/AppLoader';

export default function SettingsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <AppLoader />
    </div>
  );
}

