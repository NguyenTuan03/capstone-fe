import { buildMetadata } from '@/@crema/helper/seo';
import UserPageClient from '@/modules/dashboard/users/index';
import React from 'react';

export const metadata = buildMetadata({
  title: 'Quản lý người dùng',
  description: 'Quản lý người dùng',
});

const User = () => {
  return <UserPageClient />;
};

export default User;
