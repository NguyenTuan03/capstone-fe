import { buildUrl } from '@/@crema/helper/BuildUrl';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useApproveRequest = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(`courses/requests/${id}/approve`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const response = await axios.patch(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      return response.data;
    },
  });
};

export const useRejectRequest = () => {
  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const url = buildUrl(`courses/requests/${id}/reject`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const response = await axios.patch(
        url,
        { reason },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      return response.data;
    },
  });
};
