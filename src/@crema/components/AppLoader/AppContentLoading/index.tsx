'use client';

import { Spin } from 'antd';
import React from 'react';
type Props = {
  spinning?: boolean;
  children?: any;
  [x: string]: any;
};
const AppContentLoading = ({ spinning, children, ...rest }: Props) => {
  return (
    <Spin spinning={spinning} {...rest} className="w-full h-[100vh]">
      {children}
    </Spin>
  );
};

export default AppContentLoading;
