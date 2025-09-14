'use client';

import IntlMessages from '@/@crema/helper/IntlMessages';
import clsx from 'clsx';
import React from 'react';

type Variant = 'link' | 'primary' | 'danger' | 'neutral';

interface TableActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // IntlMessages id
  variant?: Variant; // style preset
  fullWidth?: boolean; // w-full nếu cần
  icon?: React.ReactNode; // icon trái
}

const base =
  'inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ' +
  'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ' +
  'disabled:opacity-50 disabled:pointer-events-none';

const fx = 'hover:-translate-y-[1px] active:translate-y-0'; // hiệu ứng nhấc nhẹ khi hover

const variants: Record<Variant, string> = {
  link: 'text-blue-600 hover:text-blue-700 hover:bg-gray-100 focus:ring-blue-300',
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
  neutral: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300',
};

const TableActionButton: React.FC<TableActionButtonProps> = ({
  label,
  variant = 'link',
  fullWidth,
  icon,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={clsx(base, variants[variant], fx, fullWidth && 'w-full', className)}
      {...props}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="text-[13px]">
        <IntlMessages id={label} />
      </span>
    </button>
  );
};

export default TableActionButton;
