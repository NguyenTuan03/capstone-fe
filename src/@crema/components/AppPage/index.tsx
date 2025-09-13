import { Form, FormInstance } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { MessageFormatElement, useIntl } from 'react-intl';
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
  autoFetch?: boolean;
  disableUrlSync?: boolean;
  skipRouterPush?: boolean;
  api?: {
    useGetItems: (autoFetch?: boolean) => any;
    useCreateItem?: () => any;
    useUpdateItem?: (id: number) => any;
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
      skipRouterPush = false,
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
    const isTableOrMobile = false;
    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const isEdit = useMemo(() => selectedItem !== null, [selectedItem]);

    // Use BaseApi if endpoint is provided, otherwise use legacy api
    const baseApi = useBaseApiHooks<any, any, any>(endpoint || '');

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

    // Create API object - use BaseApi if endpoint provided, otherwise use legacy api
    const apiObject = endpoint
      ? {
          getItems: () => {
            const query = baseApi.useGetItems(defaultParams);
            return {
              fetchApi: () => query,
              loading: query.isLoading,
            };
          },
          createItem: () => {
            const mutation = baseApi.useCreateItem();
            return {
              fetchApi: () => mutation,
              loading: mutation.isPending,
            };
          },
          updateItem: () => {
            const mutation = baseApi.useUpdateItem();
            return {
              fetchApi: () => mutation,
              loading: mutation.isPending,
            };
          },
        }
      : api;

    const { fetchApi: createItem, loading: createLoading } = (apiObject as any)?.createItem
      ? (apiObject as any).createItem()
      : { fetchApi: undefined, loading: false };
    const { fetchApi: updateItem, loading: updateLoading } = (apiObject as any)?.updateItem
      ? (apiObject as any).updateItem(selectedItem?.id ?? 0)
      : { fetchApi: undefined, loading: false };

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

      // Reset to page 1 if it is create and has skipRouterPush
      if (!isEdit && skipRouterPush && formListRef.current?.refreshDataWithPage) {
        formListRef.current.refreshDataWithPage(1);
      } else {
        refreshData();
      }

      addEditForm.resetFields();
      onSuccess?.();
    };

    return (
      <>
        <AppFormList
          ref={formListRef}
          columns={columns({ handleEditItem, refreshData, t })}
          getApi={(apiObject as any)?.getItems()}
          scrollX={scrollX ?? (isTableOrMobile ? 'calc(200px + 100%)' : 'calc(100%)')}
          filterItems={filterFields ?? fields}
          title={title}
          showAddButton={showAddButton ?? false}
          addFunction={() => handleAddItem()}
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
            setVisible={(visible) => {
              setVisibleModal(visible);
              if (!visible) {
                addEditForm.resetFields();
                setSelectedItem(null);
              }
            }}
            items={fields}
            createApi={createItem}
            title={modalTitle}
            updateApi={isEdit ? updateItem : undefined}
            loading={isEdit ? updateLoading : createLoading}
            handleCallbackSuccess={handleSuccess}
            model={selectedItem}
            skipRouterPush={skipRouterPush}
          />
        )}
      </>
    );
  },
);

AppPage.displayName = 'AppPage';

export default AppPage;
