import { Button, Form, Spin } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import React, { useCallback, useEffect, useMemo } from 'react';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { removeItemInvalidFromObject } from '@/@crema/helper/Common';
import { DEFAULT_PAGE_SIZE } from '@/@crema/constants/AppConst';
import { formatDatesInObject } from '@/@crema/helper/DateHelper';
import { FormInputType } from '@/@crema/constants/AppEnums';
import { useIntl } from 'react-intl';
import DynamicInputField from './DynamicInput';
import debounce from 'debounce';

interface FilterFormProps {
  form: FormInstance;
  items?: any[];
  isLoading?: boolean;
  handleFilterChange: (
    newFilterData: Record<string, any>,
    page?: number,
    pageSize?: number,
  ) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({
  form,
  items = [],
  isLoading,
  handleFilterChange,
}) => {
  const { messages } = useIntl();
  const ensureArrayFields = useCallback(
    (values: any) => {
      const result = { ...values };
      items.forEach((item) => {
        if (
          item.mode === 'multiple' &&
          result[item.name] !== undefined &&
          !Array.isArray(result[item.name])
        ) {
          result[item.name] = [result[item.name]];
        }
      });
      return result;
    },
    [items],
  );

  const handleUpdateFilter = useCallback(
    (values: any) => {
      // Don't update filter if loading
      if (isLoading) return;

      const cleanedValues = removeItemInvalidFromObject(values);
      const formattedValues = formatDatesInObject(cleanedValues, items);
      const newFilterParams = ensureArrayFields(formattedValues);

      handleFilterChange(newFilterParams, 1);
    },
    [ensureArrayFields, items, handleFilterChange, isLoading],
  );

  const debouncedFilterRef = useMemo(() => {
    return debounce((params: Record<string, any>) => {
      handleUpdateFilter(params);
    }, 1000);
  }, [handleUpdateFilter]);

  useEffect(() => {
    return () => {
      debouncedFilterRef.clear();
    };
  }, [debouncedFilterRef]);

  const handleValuesChange = useCallback(
    (_changedValues: any, allValues: any) => {
      // Don't trigger debounced filter if loading
      if (isLoading) return;

      debouncedFilterRef(allValues);
    },
    [debouncedFilterRef, isLoading],
  );

  const handleResetFilter = useCallback(async () => {
    // Don't reset filter if loading
    if (isLoading) return;

    const fieldsToReset = items
      .filter((item) => item.clearFilter !== false)
      .map((item) => item.name);

    form.resetFields(fieldsToReset);

    const allValues = form.getFieldsValue();

    const cleanedValues = removeItemInvalidFromObject(allValues);
    const formattedValues = formatDatesInObject(cleanedValues, items);
    const newFilterParams = ensureArrayFields(formattedValues);

    handleFilterChange(newFilterParams, 1, DEFAULT_PAGE_SIZE);
  }, [form, items, handleFilterChange, isLoading]);

  const initValues = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        if (item.initialValue !== undefined) {
          acc[item.name] = item.initialValue;
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [items]);

  const formItems = useMemo(() => {
    return (items || []).map((item) => {
      const { clearFilter: _clearFilter, ...itemProps } = item;

      // Convert switch type to select with true/false/null options for filtering
      let fieldType = item.type;
      let options = item.options;

      if (item.type === FormInputType.Switch) {
        fieldType = FormInputType.Select;
        // Use original switch options if they exist, otherwise use default true/false
        const switchOptions = item.options || [
          { label: messages['common.yes'] as string, value: true },
          { label: messages['common.no'] as string, value: false },
        ];
        // Add "All" option for filtering
        options = [...switchOptions, { label: messages['common.all'] as string, value: null }];
      }

      return (
        <Form.Item
          key={item.name}
          label={item.label}
          name={item.name}
          hidden={item.hide}
          style={{
            width: item.width ? item.width : '240px',
            marginBottom: '12px',
          }}
        >
          <DynamicInputField
            fieldType={fieldType}
            placeholder={item.placeholder}
            options={options}
            {...itemProps}
          />
        </Form.Item>
      );
    });
  }, [items]);

  return (
    <Spin spinning={isLoading} tip="...">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        className="filter-form"
        initialValues={initValues}
      >
        <div className="flex flex-wrap gap-[8px] justify-start items-center h-full">
          {formItems}
          <Button
            onClick={handleResetFilter}
            disabled={isLoading}
            loading={isLoading}
            style={{
              marginLeft: 10,
              // height: '35px',
              alignSelf: 'flex-end',
              marginBottom: '12px',
            }}
            danger
          >
            <IntlMessages id="common.clearFilter" />
          </Button>
        </div>
      </Form>
    </Spin>
  );
};

export default FilterForm;
