import { buildUrl } from '@/@crema/helper/BuildUrl';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useVerifyCoach = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(`coaches/${id}/verify`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const response = await axios.put(
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

export const useRejectCoach = () => {
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const url = buildUrl(`coaches/${id}/reject`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const response = await axios.put(url, reason ? { reason } : {}, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return response.data;
    },
  });
};
