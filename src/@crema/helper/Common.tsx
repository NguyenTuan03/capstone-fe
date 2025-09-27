import { Badge } from 'antd';
import dayjs from 'dayjs';
import { ReactNode } from 'react';

// 'intl' service singleton reference
export const IntlGlobalProvider = ({ children }: { children: ReactNode }): any => {
  // Keep the 'intl' service reference
  return children;
};

export const removeItemInvalidFromObject = (obj: any): any => {
  const newObj: any = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const isPlainObject =
      Object.prototype.toString.call(value) === '[object Object]' &&
      !dayjs.isDayjs(value) &&
      !(value instanceof Date);

    if (value !== undefined && value !== null && value !== '') {
      newObj[key] = isPlainObject ? removeItemInvalidFromObject(value) : value;
    }
  });

  return newObj;
};
interface WrapIconWithBadgeOptions {
  mainIcon: React.ReactNode;
  badgeIcon?: React.ReactNode;
  badge?: number;
  dot?: boolean;
  offset?: [number, number];
  color?: string;
}
export const wrapIconWithBadge = (options: WrapIconWithBadgeOptions) => {
  const { mainIcon, badgeIcon, badge, dot, offset = [0, 0], color = 'blue' } = options;

  if (!mainIcon) return null;

  return badge || dot || badgeIcon ? (
    <Badge
      offset={offset}
      count={badgeIcon || (typeof badge === 'number' && badge > 0 ? badge : undefined)}
      size="small"
      dot={dot && !badgeIcon}
      color={color}
      style={{ zIndex: 1000 }}
    >
      {mainIcon}
    </Badge>
  ) : (
    mainIcon
  );
};
