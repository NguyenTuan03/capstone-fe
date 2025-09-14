'use client';

import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AppsContainer from '../AppsContainer';
import AppFilterTable from './AppFilterTable';
import ListTable from './Table';
import useUrlFilter from '@/@crema/hooks/useUrlFilter';
import type { ApiOptions, PaginatedAPIResponse } from '@/@crema/types/api';

export interface FilterItem {
  type: any; // giữ nguyên theo enum FormInputType ở project của bạn
  name: string;
  label?: string;
  placeholder?: string;
  options?: any[];
  [x: string]: any;
}

export interface FetchApi {
  fetchApi: (options?: ApiOptions<void>, isFetch?: boolean) => Promise<any>;
  loading: boolean;
  data: PaginatedAPIResponse<any>;
}

interface AppFormListProps {
  columns: ColumnsType<any>;
  getApi: FetchApi;
  filterItems?: FilterItem[];
  title?: string;
  scrollX?: string;
  showAddButton?: boolean;
  addFunction?: () => void;
  searchItems?: React.ReactNode;
  additionalActionInFilter?: React.ReactNode;
  customActionButtons?: React.ReactNode;
  defaultParams?: Record<string, any>;
  disableUrlSync?: boolean;
}

interface AppFormListRef {
  refreshData: () => void;
  setCurrPage: (page: number) => void;
  refreshDataWithPage: (page: number) => void;
}

const AppFormList = forwardRef<AppFormListRef, AppFormListProps>(
  (
    {
      columns,
      scrollX = 'calc(500px + 100%)',
      filterItems,
      getApi,
      addFunction,
      showAddButton = false,
      searchItems,
      additionalActionInFilter,
      customActionButtons,
      defaultParams,
      disableUrlSync = false,
    },
    ref,
  ) => {
    const [form] = Form.useForm();
    const [filterHeight, setFilterHeight] = useState<number>(0);

    const { fetchApi, data, loading } = getApi;
    const total = data?.total ?? 0;

    const wrappedFetchApi = useCallback(
      (options: any) => {
        const params = options?.params || {};
        const mergedParams = { ...(defaultParams ?? {}), ...params };
        return fetchApi({ ...options, params: mergedParams });
      },
      [fetchApi, defaultParams],
    );

    const {
      currPage,
      currPageSize,
      filterData,
      handleFilterChange,
      handlePageChange,
      refreshData,
      handleSortChange,
      setCurrPage,
      handleFetchData,
    } = useUrlFilter({
      form,
      filterItems: filterItems ?? [],
      fetchApi: wrappedFetchApi,
      disableUrlSync,
    });

    const refreshDataWithPage = useCallback(
      (page: number) => {
        setCurrPage(page);
        handleFetchData(page, currPageSize, filterData);
      },
      [setCurrPage, handleFetchData, currPageSize, filterData],
    );

    useImperativeHandle(ref, () => ({
      refreshData,
      setCurrPage,
      refreshDataWithPage,
    }));

    return (
      <AppsContainer>
        {/* Header + Filter */}
        <div className="w-full">
          <AppFilterTable
            form={form}
            loading={loading}
            handleFilterChange={handleFilterChange}
            filterItems={filterItems}
            addFunction={addFunction}
            showAddButton={showAddButton}
            searchItems={searchItems}
            filterData={filterData}
            setFilterHeight={setFilterHeight}
            additionalActionInFilter={additionalActionInFilter}
            customActionButtons={customActionButtons}
          />
        </div>

        {/* Table */}
        <div className="w-full">
          <ListTable
            initColumns={columns}
            total={total}
            dataSource={data?.data ?? []}
            currPage={currPage}
            currPageSize={currPageSize}
            handlePageChange={handlePageChange}
            loading={loading}
            scrollX={scrollX}
            filterData={filterData}
            handleSortChange={handleSortChange}
            filterHeight={filterHeight}
          />
        </div>
      </AppsContainer>
    );
  },
);

AppFormList.displayName = 'AppFormList';

export default AppFormList;
