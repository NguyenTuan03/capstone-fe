'use client';

import { useFormMutation } from '@/@crema/hooks/useApiQuery';

// Hooks: TanStack Query mutations for registering Coach and Learner
// Endpoints leverage URL builder in useApiQuery (auto prefixes /api/v1 when appropriate)

export const useRegisterCoach = <TResponse = any, TVariables = any>() => {
  return useFormMutation<TResponse, TVariables>('coaches/register', {
    method: 'POST',
    showSuccessMessage: true,
    successMessage: 'Đăng ký huấn luyện viên thành công!',
  });
};

export const useRegisterLearner = <TResponse = any, TVariables = any>() => {
  return useFormMutation<TResponse, TVariables>('auth/register', {
    method: 'POST',
    showSuccessMessage: true,
    successMessage: 'Đăng ký học viên thành công!',
  });
};
