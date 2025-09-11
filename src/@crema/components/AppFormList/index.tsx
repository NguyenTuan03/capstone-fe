import { FormInputType } from '@/@crema/constants/AppEnums';
import { ApiOptions, PaginatedAPIResponse } from '@/@crema/types/api';
import { ColumnsType } from 'antd/es/table';
import React, { forwardRef } from 'react';

export interface FilterItem {
  type: FormInputType;
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
      title = '',
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
    return <div>AppFormList</div>;
  },
);

AppFormList.displayName = 'AppFormList';

export default AppFormList;
