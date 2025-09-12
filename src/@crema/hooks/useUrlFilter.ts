import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants/AppConst';
import { formatQueryParams, updateUrlQuery } from '../helper/UrlHelper';
import { FormInstance } from 'antd';
// import { ApiOptions } from '@/@crema/services/useFetchApi';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FilterItem } from '../components/AppFormList';
import { removeItemInvalidFromObject } from '../helper/Common';
import { convertDatesForAntd, formatDatesInObject } from '../helper/DateHelper';
import { ApiOptions } from '../types/api';

dayjs.extend(customParseFormat);

interface UseUrlFilterOptions {
  form: FormInstance;
  filterItems?: FilterItem[];
  fetchApi: (options: ApiOptions<void>) => Promise<any>;
  disableUrlSync?: boolean;
}

const useUrlFilter = (options: UseUrlFilterOptions) => {
  const { form, fetchApi, filterItems, disableUrlSync = false } = options;
  const router = useRouter();

  const [isInitialFilterData, setIsInitialFilterData] = useState<boolean>(true);
  const [filterData, setFilterData] = useState<Record<string, any>>({});
  const [currPage, setCurrPage] = useState<number>(1);
  const [currPageSize, setCurrPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [isUrlSyncing, setIsUrlSyncing] = useState<boolean>(false);

  const handleFetchData = useCallback(
    (page = 1, pageSize: number = currPageSize, params: Record<string, any> = filterData) => {
      const queryParams = { page, limit: pageSize, ...params };
      return fetchApi({
        params: queryParams,
      });
    },
    [currPageSize, filterData],
  );

  const handleFilterChange = useCallback(
    (
      newFilterData: Record<string, any>,
      page: number = currPage,
      pageSize: number = currPageSize,
    ) => {
      if (!disableUrlSync) {
        setIsUrlSyncing(true);
        updateUrlQuery(router, page, pageSize, newFilterData);
      } else {
        // Format dates before setting filter data
        const formattedFilterData = formatDatesInObject(newFilterData, filterItems || []);
        setFilterData(formattedFilterData);
        setCurrPage(page);
        setCurrPageSize(pageSize);
      }
    },
    [router, currPageSize, disableUrlSync, filterItems],
  );

  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      if (!disableUrlSync) {
        if (page !== currPage) {
          updateUrlQuery(router, page, pageSize, filterData);
          return;
        }
        if (pageSize !== currPageSize) {
          updateUrlQuery(router, 1, pageSize, filterData);
        }
      } else {
        // Update local state when URL sync is disabled
        if (page !== currPage) {
          setCurrPage(page);
        }
        if (pageSize !== currPageSize) {
          setCurrPageSize(pageSize);
          setCurrPage(1);
        }
      }
    },
    [currPage, currPageSize, filterData, router, disableUrlSync],
  );

  const handleSortChange = useCallback(
    (newSortData: Record<string, any>) => {
      const newFilterData = { ...filterData, ...newSortData };
      if (!disableUrlSync) {
        updateUrlQuery(router, currPage, currPageSize, newFilterData);
      } else {
        setFilterData(newFilterData);
      }
    },
    [router, currPageSize, filterData, disableUrlSync],
  );

  //Update url query
  useEffect(() => {
    // Skip this effect during the initial render as we'll handle that separately
    if (isInitialFilterData) return;
    if (disableUrlSync) return;

    const { page, limit, ...filterParams } = router.query;
    const newPage = Number(page) || 1;
    const newPageSize = Number(limit) || DEFAULT_PAGE_SIZE;

    if (currPage !== newPage) setCurrPage(newPage);
    if (currPageSize !== newPageSize) setCurrPageSize(newPageSize);

    if (Object.keys(filterParams).length > 0) {
      const formattedParams = formatQueryParams(filterParams);
      const paramsWithDayjs = convertDatesForAntd(formattedParams);

      form.setFieldsValue(paramsWithDayjs);
      setFilterData(formattedParams);
    } else {
      setFilterData({});
    }

    // Reset URL syncing flag after completion
    setIsUrlSyncing(false);
  }, [router.query, disableUrlSync]);

  //Fetch data
  useEffect(() => {
    if (isInitialFilterData) return;
    // If URL sync is disabled, only fetch when not in URL syncing process
    // to avoid fetching twice (1 from URL change, 1 from state change)
    if (!disableUrlSync && isUrlSyncing) {
      return; // In URL syncing process, do not fetch
    }

    const params = Object.keys(filterData).length > 0 ? filterData : {};
    handleFetchData(currPage, currPageSize, params);
  }, [currPage, currPageSize, filterData, disableUrlSync, isUrlSyncing]);

  //Initial filter data
  useEffect(() => {
    if (!isInitialFilterData) return;

    const initialFormValues =
      filterItems?.reduce(
        (acc, item) => {
          if (item.initialValue !== undefined) {
            acc[item.name] = item.initialValue;
          }
          return acc;
        },
        {} as Record<string, any>,
      ) || {};
    const cleanedMergedValues = removeItemInvalidFromObject(initialFormValues);
    if (disableUrlSync) {
      let initialData = {};
      if (Object.keys(cleanedMergedValues).length > 0) {
        // Format dates for API before setting filter data
        const formattedInitialData = formatDatesInObject(cleanedMergedValues, filterItems || []);
        initialData = formattedInitialData;
        setFilterData(formattedInitialData);
        const formattedValues = convertDatesForAntd(cleanedMergedValues);
        form.setFieldsValue(formattedValues);
      }
      setIsInitialFilterData(false);

      // Trigger initial fetch with the initial data
      setTimeout(() => {
        handleFetchData(currPage, currPageSize, initialData);
      }, 0);
      return;
    }
    const filterParams = router.query;

    if (Object.keys(cleanedMergedValues).length === 0) {
      updateUrlQuery(router, currPage, currPageSize, filterParams);
      setIsInitialFilterData(false);
      return;
    }

    let mergedValues: Record<string, any> = { ...initialFormValues };

    if (Object.keys(filterParams).length > 0) {
      const formattedParams = formatQueryParams(filterParams);
      mergedValues = { ...mergedValues, ...formattedParams };
    }
    const formattedMergedValues = formatDatesInObject(mergedValues, filterItems || []);
    updateUrlQuery(router, currPage, currPageSize, formattedMergedValues);
    setIsInitialFilterData(false);
  }, [disableUrlSync]);

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
