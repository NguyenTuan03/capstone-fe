'use client';
import { useJWTAuth, useJWTAuthActions } from '@/@crema/services/jwt-auth/JWTAuthProvider';

export const useAuthUser = () => {
  const { user, isAuthenticated, isLoading } = useJWTAuth();
  return { user, isAuthenticated, isLoading };
};

export const useAuthActions = () => {
  const { signInUser, logout } = useJWTAuthActions();
  return { signInUser, logout };
};
