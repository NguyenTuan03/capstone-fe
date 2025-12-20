const getBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8386';
const getVersion = () => process.env.NEXT_PUBLIC_VERSION || 'v1';

const normalize = (...parts: string[]) =>
  ('/' + parts.join('/')).replace(/\/{2,}/g, '/').replace(/\/+$/g, '');

type QueryParams = Record<string, string | number | boolean | undefined | null | (string | number | boolean)[]>;

export const buildUrl = (endpoint: string, params?: QueryParams) => {
  // Tách path và query params hiện có từ endpoint
  const [path, existingQuery] = endpoint.split('?');
  
  // Tạo URL cơ bản
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
  let finalPath = path.startsWith('/')
    ? path
    : hasApiInBase
      ? normalize(basePath, version, path)
      : normalize('/api', version, path);

  // Tạo URL mới
  const url = new URL(finalPath, origin);

  // Thêm query params từ URL gốc nếu có
  if (existingQuery) {
    const searchParams = new URLSearchParams(existingQuery);
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  // Thêm các params mới
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Xử lý mảng giá trị
          value.forEach(v => 
            url.searchParams.append(key, String(v))
          );
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    });
  }

  // Đảm bảo không có dấu / thừa
  url.pathname = url.pathname.replace(/\/+$/, '');
  
  return url.toString();
};
