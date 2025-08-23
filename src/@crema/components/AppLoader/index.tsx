import { Spin } from 'antd';
import React from 'react';

const AppLoader = () => {
  return (
    <div className="flex align-middle justify-center min-h-[100%] absolute left-0 right-0 top-0 bottom-0">
      <Spin />
    </div>
  );
};

export default AppLoader;
