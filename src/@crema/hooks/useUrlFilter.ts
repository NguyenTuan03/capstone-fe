'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants/AppConst';
import { formatQueryParams, updateUrlQuery } from '../helper/UrlHelper';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { FilterItem } from '../components/AppFormList';
import { removeItemInvalidFromObject } from '../helper/Common';
import { convertDatesForAntd, formatDatesInObject } from '../helper/DateHelper';
import type { ApiOptions } from '../types/api';

dayjs.extend(customParseFormat);

interface UseUrlFilterOptions {
  form: FormInstance;
  filterItems?: FilterItem[];
  fetchApi: (options: ApiOptions<void>) => Promise<any>;
  disableUrlSync?: boolean;
}

const useUrlFilter = (options: UseUrlFilterOptions) => {
  const { form, fetchApi, filterItems, disableUrlSync = false } = options;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isInitialFilterData, setIsInitialFilterData] = useState<boolean>(true);
  const [filterData, setFilterData] = useState<Record<string, any>>({});
  const [currPage, setCurrPage] = useState<number>(1);
  const [currPageSize, setCurrPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [isUrlSyncing, setIsUrlSyncing] = useState<boolean>(false);

  const handleFetchData = useCallback(
    (page = 1, pageSize: number = currPageSize, params: Record<string, any> = filterData) => {
      const queryParams = { page, limit: pageSize, ...params };
      return fetchApi({ params: queryParams });
    },
    [fetchApi, currPageSize, filterData],
  );

  const handleFilterChange = useCallback(
    (
      newFilterData: Record<string, any>,
      page: number = currPage,
      pageSize: number = currPageSize,
    ) => {
      if (!disableUrlSync) {
        setIsUrlSyncing(true);
        updateUrlQuery({ router, pathname, searchParams, page, pageSize, filters: newFilterData });
      } else {
        const formatted = formatDatesInObject(newFilterData, filterItems || []);
        setFilterData(formatted);
        setCurrPage(page);
        setCurrPageSize(pageSize);
      }
    },
    [router, pathname, searchParams, currPage, currPageSize, disableUrlSync, filterItems],
  );

  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      if (!disableUrlSync) {
        updateUrlQuery({ router, pathname, searchParams, page, pageSize, filters: filterData });
      } else {
        if (page !== currPage) setCurrPage(page);
        if (pageSize !== currPageSize) {
          setCurrPageSize(pageSize);
          setCurrPage(1);
        }
      }
    },
    [disableUrlSync, router, pathname, searchParams, filterData, currPage, currPageSize],
  );

  const handleSortChange = useCallback(
    (newSortData: Record<string, any>) => {
      const merged = { ...filterData, ...newSortData };
      if (!disableUrlSync) {
        updateUrlQuery({
          router,
          pathname,
          searchParams,
          page: currPage,
          pageSize: currPageSize,
          filters: merged,
        });
      } else {
        setFilterData(merged);
      }
    },
    [disableUrlSync, router, pathname, searchParams, currPage, currPageSize, filterData],
  );

  // phản ứng khi URL đổi (App Router)
  useEffect(() => {
    if (isInitialFilterData) return;
    if (disableUrlSync) return;

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || DEFAULT_PAGE_SIZE);

    if (currPage !== page) setCurrPage(page);
    if (currPageSize !== limit) setCurrPageSize(limit);

    const rawParams: Record<string, any> = {};
    searchParams.forEach((v, k) => {
      if (!['page', 'limit'].includes(k)) rawParams[k] = v;
    });

    const formattedParams = formatQueryParams(rawParams);
    const paramsWithDayjs = convertDatesForAntd(formattedParams);

    form.setFieldsValue(paramsWithDayjs);
    setFilterData(formattedParams);

    setIsUrlSyncing(false);
  }, [searchParams, disableUrlSync, currPage, currPageSize, form, isInitialFilterData]);

  // fetch mỗi khi state đổi
  useEffect(() => {
    if (isInitialFilterData) return;
    if (!disableUrlSync && isUrlSyncing) return;

    const params = Object.keys(filterData).length > 0 ? filterData : {};
    handleFetchData(currPage, currPageSize, params);
  }, [
    currPage,
    currPageSize,
    filterData,
    disableUrlSync,
    isUrlSyncing,
    handleFetchData,
    isInitialFilterData,
  ]);

  // khởi tạo từ initialValues + URL
  useEffect(() => {
    if (!isInitialFilterData) return;

    const initialFormValues =
      filterItems?.reduce(
        (acc, item) => {
          if (item.initialValue !== undefined) acc[item.name] = item.initialValue;
          return acc;
        },
        {} as Record<string, any>,
      ) || {};

    const cleaned = removeItemInvalidFromObject(initialFormValues);

    if (disableUrlSync) {
      let initialData: Record<string, any> = {};
      if (Object.keys(cleaned).length > 0) {
        const formatted = formatDatesInObject(cleaned, filterItems || []);
        initialData = formatted;
        setFilterData(formatted);
        const forAntd = convertDatesForAntd(cleaned);
        form.setFieldsValue(forAntd);
      }
      setIsInitialFilterData(false);
      setTimeout(() => handleFetchData(currPage, currPageSize, initialData), 0);
      return;
    }

    // merge với URL hiện tại
    const fromUrl: Record<string, any> = {};
    searchParams.forEach((v, k) => {
      if (!['page', 'limit'].includes(k)) fromUrl[k] = v;
    });

    const merged = { ...initialFormValues, ...formatQueryParams(fromUrl) };
    updateUrlQuery({
      router,
      pathname,
      searchParams,
      page: currPage,
      pageSize: currPageSize,
      filters: merged,
    });
    setIsInitialFilterData(false);
  }, [
    disableUrlSync,
    currPage,
    currPageSize,
    filterItems,
    form,
    handleFetchData,
    isInitialFilterData,
    router,
    pathname,
    searchParams,
  ]);

  const refreshData = useCallback(() => {
    handleFetchData(currPage, currPageSize, filterData);
  }, [currPage, currPageSize, filterData, handleFetchData]);

  return {
    currPage,
    currPageSize,
    filterData,
    handleFilterChange,
    handlePageChange,
    refreshData,
    setCurrPage,
    setCurrPageSize,
    setFilterData,
    handleSortChange,
    handleFetchData,
  };
};

export default useUrlFilter;
