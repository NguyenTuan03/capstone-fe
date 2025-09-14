'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, Form, Spin } from 'antd';
import type { FormInstance } from 'antd';
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
      if (isLoading) return;
      const cleanedValues = removeItemInvalidFromObject(values);
      const formattedValues = formatDatesInObject(cleanedValues, items);
      const newParams = ensureArrayFields(formattedValues);
      handleFilterChange(newParams, 1);
    },
    [ensureArrayFields, items, handleFilterChange, isLoading],
  );

  const debouncedFilterRef = useMemo(
    () => debounce((params: Record<string, any>) => handleUpdateFilter(params), 1000),
    [handleUpdateFilter],
  );

  useEffect(() => {
    return () => {
      debouncedFilterRef.clear();
    };
  }, [debouncedFilterRef]);

  const handleValuesChange = useCallback(
    (_changed: any, allValues: any) => {
      if (isLoading) return;
      debouncedFilterRef(allValues);
    },
    [debouncedFilterRef, isLoading],
  );

  const handleResetFilter = useCallback(async () => {
    if (isLoading) return;
    const fieldsToReset = items.filter((i) => i.clearFilter !== false).map((i) => i.name);
    form.resetFields(fieldsToReset);

    const all = form.getFieldsValue();
    const cleaned = removeItemInvalidFromObject(all);
    const formatted = formatDatesInObject(cleaned, items);
    const newParams = ensureArrayFields(formatted);

    handleFilterChange(newParams, 1, DEFAULT_PAGE_SIZE);
  }, [form, items, handleFilterChange, isLoading, ensureArrayFields]);

  const initValues = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        if (item.initialValue !== undefined) acc[item.name] = item.initialValue;
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [items]);

  const formItems = useMemo(() => {
    return (items || []).map((item) => {
      const { clearFilter: _skip, ...itemProps } = item; // eslint-disable-line @typescript-eslint/no-unused-vars
      // Switch → Select ở filter
      let fieldType = item.type;
      let options = item.options;

      if (item.type === FormInputType.Switch) {
        fieldType = FormInputType.Select;
        const switchOptions = item.options || [
          { label: messages['common.yes'] as string, value: true },
          { label: messages['common.no'] as string, value: false },
        ];
        options = [...switchOptions, { label: messages['common.all'] as string, value: null }];
      }

      return (
        <Form.Item
          key={item.name}
          label={item.label}
          name={item.name}
          hidden={item.hide}
          className="mb-3 w-[240px]" // tailwind width và spacing
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
  }, [items, messages]);

  return (
    <Spin spinning={isLoading} tip="...">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        className="filter-form"
        initialValues={initValues}
      >
        <div className="flex flex-wrap gap-2 justify-start items-end">
          {formItems}

          <Button
            onClick={handleResetFilter}
            disabled={isLoading}
            loading={isLoading}
            danger
            className="ml-2 mb-3"
          >
            <IntlMessages id="common.clearFilter" />
          </Button>
        </div>
      </Form>
    </Spin>
  );
};

export default FilterForm;
