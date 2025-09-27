'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd';
import { Badge, Flex } from 'antd';
import useBreakpoint from 'use-breakpoint';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { VscFilterFilled } from 'react-icons/vsc';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdAddCircleOutline } from 'react-icons/md';
import FilterForm from './FilterForm';
import type { FilterItem } from '..';

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
  setFilterHeight?: React.Dispatch<React.SetStateAction<number>>;
  additionalActionInFilter?: React.ReactNode;
  customActionButtons?: React.ReactNode;
}

const EXCLUDED_KEYS = ['order_by', 'order_direction', 'page', 'limit'];

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
  const isTabletOrMobile = breakpoint === 'tablet' || breakpoint === 'mobile';

  const [isOpen, setIsOpen] = useState(!isTabletOrMobile);
  const [activeFilterCount, setActiveFilterCount] = useState<number>(0);
  const filterRef = useRef<HTMLDivElement>(null);

  const isValidFilterValue = (value: any): boolean => {
    if (value === undefined || value === null || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (value && typeof value === 'object') {
      if ((value as any).$isDayjsObject) return true;
      if (Object.keys(value).length === 0) return false;
    }
    return true;
  };

  useEffect(() => {
    setIsOpen(!isTabletOrMobile);
  }, [isTabletOrMobile]);

  // đếm filter đang active
  useEffect(() => {
    const values = form.getFieldsValue();
    const data = filterData || values;
    const count = Object.entries(data).filter(
      ([k, v]) => isValidFilterValue(v) && !EXCLUDED_KEYS.includes(k),
    ).length;
    setActiveFilterCount(count);
  }, [form, filterData]);

  // báo chiều cao filter cho parent tính scroll
  useEffect(() => {
    if (!filterRef.current) return;
    const el = filterRef.current;
    const ro = new ResizeObserver(() => {
      setFilterHeight?.(el.getBoundingClientRect().height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [setFilterHeight, isOpen]);

  const containerCls = 'w-full px-5 pt-2.5 pb-1.5';
  const toggleCls =
    'flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-600 cursor-pointer select-none';
  const addBtnCls =
    'inline-flex items-center justify-center bg-blue-600 text-white border-0 px-3.5 py-3 mb-2.5 rounded cursor-pointer font-semibold transition-colors duration-200 hover:bg-blue-500';

  const panelCls = useMemo(
    () =>
      [
        'overflow-hidden w-full my-2.5 origin-top transition-all duration-500 ease-out',
        isOpen ? 'max-h-[1000px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95',
      ].join(' '),
    [isOpen],
  );

  if (!filterItems) return null;

  return (
    <div className={containerCls} ref={filterRef}>
      <Flex justify="space-between" align="center" className="w-full">
        <Flex align="center" gap={20}>
          <div className={toggleCls} onClick={() => setIsOpen((v) => !v)}>
            <Badge count={activeFilterCount} size="small" color="blue">
              <VscFilterFilled size={16} className="text-blue-600" />
            </Badge>
            <span>
              <IntlMessages id="common.filter.icon" />
            </span>
            {isOpen ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
          </div>
          {searchItems}
        </Flex>

        <Flex gap={10} align="center">
          {showAddButton && (
            <div className={addBtnCls} onClick={addFunction}>
              <MdAddCircleOutline size={18} className="mr-1" />
              <IntlMessages id="common.createNew" />
            </div>
          )}
          {customActionButtons}
        </Flex>
      </Flex>

      <div className={panelCls}>
        <FilterForm
          form={form}
          items={filterItems}
          isLoading={loading}
          handleFilterChange={handleFilterChange}
        />
      </div>

      {additionalActionInFilter}
    </div>
  );
};

export default AppFilterTable;
