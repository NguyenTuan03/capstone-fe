import React from 'react';

const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export default AppContextProvider;
