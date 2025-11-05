'use client';
import React, { useState } from 'react';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const StudentsPage = () => {
  const { isAuthorized, isChecking } = useRoleGuard(['COACH'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    LEARNER: '/home',
  });
  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }
  return (
    <div>
      <h1>Students Page</h1>
    </div>
  );
};

export default StudentsPage;
