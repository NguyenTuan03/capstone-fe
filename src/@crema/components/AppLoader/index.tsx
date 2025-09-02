'use client';

import { Spin } from 'antd';
import React from 'react';

const AppLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
      <Spin size="large" />
    </div>
  );
};

export default AppLoader;
