import { buildUrl } from '@/@crema/helper/BuildUrl';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Province {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  provinceId?: number;
}

export const useGetProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const url = buildUrl('provinces');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data as Province[] | { items: Province[] };
    },
  });
};

export const useGetDistricts = (provinceId?: number | null) => {
  return useQuery({
    queryKey: ['districts', provinceId],
    queryFn: async () => {
      if (!provinceId) {
        return [];
      }
      const url = buildUrl(`provinces/${provinceId}/districts`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data as District[] | { items: District[] };
    },
    enabled: !!provinceId,
  });
};
