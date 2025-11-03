import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const getBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8386';
const getVersion = () => process.env.NEXT_PUBLIC_VERSION || 'v1';

const normalize = (...parts: string[]) =>
  ('/' + parts.join('/')).replace(/\/{2,}/g, '/').replace(/\/+$/g, '');

const buildUrl = (endpoint: string) => {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  const baseRaw = getBase();
  let origin = 'http://localhost:8386';
  let basePath = '/';
  try {
    const u = new URL(baseRaw);
    origin = `${u.protocol}//${u.host}`;
    basePath = u.pathname || '/';
  } catch {}
  const version = getVersion();
  const hasApiInBase = basePath.split('/').includes('api');
  const finalPath = endpoint.startsWith('/')
    ? endpoint
    : hasApiInBase
      ? normalize(basePath, version, endpoint)
      : normalize('/api', version, endpoint);
  const url = new URL(finalPath, origin);
  return url.toString();
};

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
