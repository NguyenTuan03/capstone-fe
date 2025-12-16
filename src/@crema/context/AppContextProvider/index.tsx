import React from 'react';
import { SocketProvider } from '../SocketContext';

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SocketProvider enabled={true}>{children}</SocketProvider>;
};

export default AppContextProvider;
