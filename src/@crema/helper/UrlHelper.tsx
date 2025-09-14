// helper/UrlHelper.ts
'use client';

import { ReadonlyURLSearchParams } from 'next/navigation';

export function buildSearchString(
  searchParams: ReadonlyURLSearchParams,
  updates: Record<string, any>,
) {
  const sp = new URLSearchParams(searchParams.toString());
  Object.entries(updates).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') sp.delete(k);
    else sp.set(k, String(v));
  });
  return sp.toString();
}

export function updateUrlQuery({
  router,
  pathname,
  searchParams,
  page,
  pageSize,
  filters,
}: {
  router: any;
  pathname: string | null;
  searchParams: ReadonlyURLSearchParams;
  page: number;
  pageSize: number;
  filters: Record<string, any>;
}) {
  const base = {
    page,
    limit: pageSize,
    ...filters,
  };
  const qs = buildSearchString(searchParams, base);
  router.push(`${pathname}?${qs}`, { scroll: false });
}

export function formatQueryParams(obj: Record<string, any>) {
  // ép kiểu đúng: true/false/null/number khi có thể
  const out: Record<string, any> = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === 'true') out[k] = true;
    else if (v === 'false') out[k] = false;
    else if (v === 'null') out[k] = null;
    else if (!Number.isNaN(Number(v)) && v !== '' && /^[0-9]+(\.[0-9]+)?$/.test(String(v)))
      out[k] = Number(v);
    else out[k] = v;
  });
  return out;
}
