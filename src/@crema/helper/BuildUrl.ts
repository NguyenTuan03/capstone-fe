const getBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8386';
const getVersion = () => process.env.NEXT_PUBLIC_VERSION || 'v1';

const normalize = (...parts: string[]) =>
  ('/' + parts.join('/')).replace(/\/{2,}/g, '/').replace(/\/+$/g, '');

export const buildUrl = (endpoint: string) => {
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
  return new URL(finalPath, origin).toString();
};
