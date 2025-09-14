'use client';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Form, FormInstance } from 'antd';
import { useIntl, MessageFormatElement } from 'react-intl';
import AppFormList from '../AppFormList';
import AppAddEditModal from '../AppAddEditModal';
import { useBaseApiHooks } from '@/@crema/services/apis/BaseApi';

interface AppPageRef {
  getFormInstance: () => FormInstance;
}

interface AppPageData {
  selectedItem?: any;
  currentData?: any;
  formVisible?: boolean;
  isEdit?: boolean;
}

interface AppPageProps {
  title: string;
  autoFetch?: boolean; // (reserved)
  disableUrlSync?: boolean;
  skipRouterPush?: boolean;
  api?: {
    useGetItems: (params?: Record<string, any>) => any;
    useCreateItem?: () => any;
    useUpdateItem?: () => any;
  };
  endpoint?: string;

  columns: (props: {
    handleEditItem: (item: any) => void;
    refreshData: () => void;
    t?: Record<string, string> | Record<string, MessageFormatElement[]>;
  }) => any[];

  fields?: any[];
  filterFields?: any[];
  scrollX?: string;
  showAddButton?: boolean;
  searchItems?: React.ReactNode;
  onAdd?: () => void;
  onSuccess?: () => void;
  additionalActionInFilter?: React.ReactNode;
  customActionButtons?: React.ReactNode;
  defaultParams?: Record<string, any>;
  onStateChange?: (state: AppPageData) => void;
}

const AppPage = forwardRef<AppPageRef, AppPageProps>(
  (
    {
      title,
      disableUrlSync = false,
      skipRouterPush = false, // vẫn giữ prop để tương thích AppAddEditModal
      api,
      endpoint,
      columns,
      showAddButton,
      fields,
      filterFields,
      scrollX,
      searchItems,
      onAdd,
      onSuccess,
      additionalActionInFilter,
      customActionButtons,
      defaultParams,
      onStateChange,
    },
    ref,
  ) => {
    const [addEditForm] = Form.useForm();
    const { messages: t } = useIntl();

    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const isEdit = useMemo(() => selectedItem !== null, [selectedItem]);

    // ---------- Base API (TanStack) ----------
    const baseApi = useBaseApiHooks<any, any, any>(endpoint || '');
    // Params dùng cho useGetItems, thay đổi sẽ trigger query refetch
    const [listParams, setListParams] = useState<Record<string, any>>(defaultParams ?? {});
    const listQuery = endpoint ? baseApi.useGetItems(listParams) : api?.useGetItems?.(listParams);

    // Ref để lưu query instance để refetch
    const queryRef = useRef(listQuery);
    queryRef.current = listQuery;

    // expose state ra ngoài nếu cần
    useEffect(() => {
      onStateChange?.({
        selectedItem,
        isEdit,
        formVisible: visibleModal,
        currentData: selectedItem,
      });
    }, [selectedItem, isEdit, visibleModal, onStateChange]);

    useImperativeHandle(ref, () => ({
      getFormInstance: () => addEditForm,
    }));

    // ---------- Adapter getApi cho AppFormList ----------
    const getItemsAdapter = useMemo(() => {
      // AppFormList mong: { fetchApi(options), loading, data }
      const fetchApi = async (options?: { params?: Record<string, any> }) => {
        // Chỉ refetch với params mới, không set state
        const res = await queryRef.current?.refetch?.();
        return res?.data;
      };

      return {
        fetchApi,
        loading: !!(listQuery?.isFetching || listQuery?.isLoading),
        data: listQuery?.data, // PaginatedAPIResponse<any>
      };
    }, [listQuery?.isFetching, listQuery?.isLoading, listQuery?.data]);

    // ---------- Adapter mutation cho AppAddEditModal ----------
    // AppAddEditModal gọi operation({ payload, onSuccess, onError })
    const createAdapter = endpoint
      ? (() => {
          const m = baseApi.useCreateItem();
          return async ({
            payload,
            onSuccess,
            onError,
          }: {
            payload: any;
            onSuccess?: (data: any) => void;
            onError?: (e: any) => void;
          }) => {
            m.mutate(payload, {
              onSuccess: (data) => {
                onSuccess?.(data);
              },
              onError: (e) => onError?.(e),
            });
          };
        })()
      : api?.useCreateItem?.();

    const updateAdapter = endpoint
      ? (() => {
          const m = baseApi.useUpdateItem();
          return async ({
            payload,
            onSuccess,
            onError,
          }: {
            payload: { id: string | number; data: any } | any;
            onSuccess?: (data: any) => void;
            onError?: (e: any) => void;
          }) => {
            // Chuẩn payload cho BaseApi: { id, data }
            const final =
              payload && payload.id !== undefined && payload.data !== undefined
                ? payload
                : { id: selectedItem?.id, data: payload };
            m.mutate(final, {
              onSuccess: (data) => onSuccess?.(data),
              onError: (e) => onError?.(e),
            });
          };
        })()
      : api?.useUpdateItem?.();

    // ---------- refs + helpers ----------
    const formListRef = useRef<any>(null);
    const modalTitle = (isEdit ? t['common.edit'] : t['common.add']) as string;

    const refreshData = () => {
      formListRef.current?.refreshData();
      setSelectedItem(null);
    };

    const handleAddItem = () => {
      setSelectedItem(null);
      addEditForm.resetFields();
      setVisibleModal(true);
      onAdd?.();
    };

    const handleEditItem = (item: any) => {
      setSelectedItem(item);
      setVisibleModal(true);
    };

    const handleSuccess = () => {
      setVisibleModal(false);
      // reset page 1 nếu cần, AppFormList có sẵn hàm này
      if (!isEdit && formListRef.current?.refreshDataWithPage) {
        formListRef.current.refreshDataWithPage(1);
      } else {
        refreshData();
      }
      addEditForm.resetFields();
      onSuccess?.();
    };

    return (
      <div className="w-full">
        <AppFormList
          ref={formListRef}
          columns={columns({ handleEditItem, refreshData, t })}
          getApi={getItemsAdapter}
          scrollX={scrollX ?? 'calc(100%)'}
          filterItems={filterFields ?? fields}
          title={title}
          showAddButton={showAddButton ?? false}
          addFunction={handleAddItem}
          searchItems={searchItems}
          additionalActionInFilter={additionalActionInFilter}
          customActionButtons={customActionButtons}
          defaultParams={defaultParams}
          disableUrlSync={disableUrlSync}
        />

        {visibleModal && fields && (
          <AppAddEditModal
            form={addEditForm}
            isEdit={isEdit}
            visible={visibleModal}
            setVisible={(v) => {
              setVisibleModal(v);
              if (!v) {
                addEditForm.resetFields();
                setSelectedItem(null);
              }
            }}
            items={fields}
            createApi={createAdapter}
            title={modalTitle}
            updateApi={isEdit ? updateAdapter : undefined}
            loading={
              // optional: nếu muốn hiển thị loading từ mutation, bạn có thể map thêm isPending
              false
            }
            handleCallbackSuccess={handleSuccess}
            model={selectedItem}
            skipRouterPush={skipRouterPush}
          />
        )}
      </div>
    );
  },
);

AppPage.displayName = 'AppPage';

export default AppPage;
