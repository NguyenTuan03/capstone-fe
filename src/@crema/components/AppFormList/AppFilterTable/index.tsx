import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import { FormInstance } from 'antd/lib/form/Form';
import { FilterItem } from '..';
import { Flex, Badge } from 'antd';
import useBreakpoint from 'use-breakpoint';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { VscFilterFilled } from 'react-icons/vsc';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdAddCircleOutline } from 'react-icons/md';
import FilterForm from './FilterForm';

interface AppFilterTableProps {
  form: FormInstance;
  loading: boolean;
  filterItems?: FilterItem[];
  handleFilterChange: (
    newFilterData: Record<string, any>,
    page?: number,
    pageSize?: number,
  ) => void;
  showAddButton?: boolean;
  addFunction?: () => void;
  searchItems?: React.ReactNode;
  filterData?: Record<string, any>;
  setFilterHeight?: React.Dispatch<SetStateAction<number>>;
  additionalActionInFilter?: React.ReactNode;
  customActionButtons?: React.ReactNode;
}

const excludeFilterCountKeys = ['order_by', 'order_direction', 'page', 'limit'];

const AppFilterTable: React.FC<AppFilterTableProps> = ({
  form,
  loading,
  filterItems,
  handleFilterChange,
  addFunction,
  showAddButton,
  searchItems,
  filterData,
  setFilterHeight,
  additionalActionInFilter,
  customActionButtons,
}) => {
  const { breakpoint } = useBreakpoint({ tablet: 1024, mobile: 768 });
  const isTableOrMobile = breakpoint === 'tablet' || breakpoint === 'mobile';
  const [isCollapse, setIsCollapse] = useState(!isTableOrMobile);
  const [activeFilterCount, setActiveFilterCount] = useState<number>(0);
  const filterRef = useRef<HTMLDivElement>(null);

  const isValidFilterValue = (value: any): boolean => {
    if (value === undefined || value === null || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (value && typeof value === 'object') {
      if (value.$isDayjsObject) return true;
      if (Object.keys(value).length === 0) return false;
    }
    return true;
  };

  const handleOpenFilterForm = () => {
    setIsCollapse(!isCollapse);
  };

  useEffect(() => {
    setIsCollapse(!isTableOrMobile);
  }, [isTableOrMobile]);

  useEffect(() => {
    const formValues = form.getFieldsValue();
    const dataToCheck = filterData || formValues;

    const activeFilters = Object.entries(dataToCheck).filter(([field, value]) => {
      return isValidFilterValue(value) && !excludeFilterCountKeys.includes(field);
    });

    setActiveFilterCount(activeFilters.length);
  }, [form, filterData]);

  useEffect(() => {
    if (filterRef.current) {
      const height = filterRef.current.getBoundingClientRect().height;
      setFilterHeight?.(height);
    }
  }, [isCollapse, setFilterHeight]);

  if (!filterItems) return null;
  const renderFilterForm = () => {
    return (
      <div
        className="overflow-hidden w-full my-[10px] [transition-property:height,opacity,transform] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] [&_ .ant-form-vertical_.ant-form-item:not(.ant-form-item-horizontal)_.ant-form-item-label]:pb-1"
        style={{
          height: isCollapse ? 'auto' : 0,
          opacity: isCollapse ? 1 : 0,
          transform: isCollapse ? 'scaleY(1)' : 'scaleY(0.9)',
          transformOrigin: 'top',
        }}
      >
        <FilterForm
          form={form}
          items={filterItems}
          isLoading={loading}
          handleFilterChange={handleFilterChange}
        />
      </div>
    );
  };

  return (
    <div className="w-full p-[10px_20px_5px_20px]" ref={filterRef}>
      <Flex justify={'space-between'} align={'center'}>
        <Flex align="center" gap="20px">
          <div
            className="flex items-center justify-center gap-2 text-14px font-bold text-[#1677ff] transition-duration-300 hover:text-[#1677ff] hover:transition-duration-300"
            onClick={handleOpenFilterForm}
          >
            <Badge count={activeFilterCount} size="small" color="blue">
              <VscFilterFilled size={16} color="#1677ff" />
            </Badge>
            <IntlMessages id="forecast.filter.icon" />
            {isCollapse ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
          </div>
          {searchItems}
        </Flex>
        <Flex gap={10}>
          {showAddButton && (
            <div
              className="inline-flex items-center justify-center bg-[#007bff] text-white border-none p-[16px_10px] mb-[10px] rounded-[4px] cursor-pointer font-semibold transition-duration-400 hover:bg-[#3380be]"
              onClick={addFunction}
            >
              <MdAddCircleOutline size={18} />
              <IntlMessages id="common.createNew" />
            </div>
          )}
          {customActionButtons}
        </Flex>
      </Flex>
      {renderFilterForm()}
      {additionalActionInFilter}
    </div>
  );
};

export default AppFilterTable;
