'use client';

import React from 'react';
import QueryProvider from '@/@crema/context/AppQueryProvider/QueryContextProvider';

interface ProviderProps {
  children: React.ReactNode;
}

const AppQueryProvider: React.FC<ProviderProps> = ({ children }) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default AppQueryProvider;
