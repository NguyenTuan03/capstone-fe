import { Form, FormInstance } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { MessageFormatElement, useIntl } from 'react-intl';
import AppFormList from '../AppFormList';
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
  api: {
    getItems: (autoFetch?: boolean) => any;
    createItem?: () => any;
    updateItem?: (id: number) => any;
  };
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
      autoFetch = false,
      disableUrlSync = false,
      skipRouterPush = false,
      api,
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
    useEffect(() => {
      onStateChange?.({
        selectedItem,
        isEdit,
        formVisible: visibleModal,
        currentData: selectedItem,
      });
    }, [selectedItem, isEdit, visibleModal]);

    useImperativeHandle(ref, () => ({
      getFormInstance: () => addEditForm,
    }));

    const { fetchApi: createItem, loading: createLoading } = api.createItem
      ? api.createItem()
      : { fetchApi: undefined, loading: false };
    const { fetchApi: updateItem, loading: updateLoading } = api.updateItem
      ? api.updateItem(selectedItem?.id ?? 0)
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
          getApi={api.getItems(autoFetch)}
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
      </>
    );
  },
);

AppPage.displayName = 'AppPage';

export default AppPage;
