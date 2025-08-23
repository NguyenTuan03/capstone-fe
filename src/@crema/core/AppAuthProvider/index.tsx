import JWTAuthAuthProvider from '@/@crema/services/jwt-auth/JWTAuthProvider';
import React from 'react';

const AppAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <JWTAuthAuthProvider>{children}</JWTAuthAuthProvider>;
};

export default AppAuthProvider;
