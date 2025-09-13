import { buildMetadata } from '@/@crema/helper/seo';
import UserPage from '@/modules/dashboard/users';
import React from 'react';

export const metadata = buildMetadata({
  title: 'Quản lý người dùng',
  description: 'Quản lý người dùng',
});

const User = () => {
  return <UserPage />;
};

export default User;
