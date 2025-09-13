import dayjs from 'dayjs';
import { DATE_FORMATS, DATE_TIME_FORMAT, YEAR_MONTH_DATE_FORMAT } from '../constants/AppConst';
export const isDate = function (date: string | null): boolean {
  if (!date) return false;
  for (const format of DATE_FORMATS) {
    const parsed = dayjs(date, format, true);
    if (parsed.isValid()) {
      return true;
    }
  }
  return false;
};
export const isDayjsObject = (value: any) => {
  return value && value.$isDayjsObject;
};
export const stringToAntdDate = (dateString: string, formats?: string[]): any => {
  if (typeof dateString !== 'string' || dateString.length < 6) {
    return dateString;
  }
  if (!isDate(dateString)) {
    return dateString;
  }

  const formatsToTry = formats || DATE_FORMATS;

  for (const format of formatsToTry) {
    const dateObj = dayjs(dateString, format, true);
    if (dateObj.isValid()) {
      return dateObj;
    }
  }

  const dateObj = dayjs(dateString);
  if (dateObj.isValid()) {
    return dateObj;
  }

  return dateString;
};
export const convertDatesForAntd = (params: Record<string, any>): Record<string, any> => {
  if (!params || typeof params !== 'object') return params;

  const result = { ...params };

  Object.keys(result).forEach((key) => {
    const value = result[key];
    result[key] = stringToAntdDate(value);
  });

  return result;
};

export const formatDatesInObject = (obj: Record<string, any>, fields: any[]) => {
  const newObj = { ...obj };

  for (const key in newObj) {
    const value = newObj[key];

    const field = fields.find((f) => f.name === key);

    if (isDayjsObject(value)) {
      const customFormat = field?.format;
      const formatToApply = customFormat || YEAR_MONTH_DATE_FORMAT;
      newObj[key] = value?.format(formatToApply);
    }
  }
  return newObj;
};

export const getFormattedDate = (
  dateObject?: string | dayjs.Dayjs,
  format = DATE_TIME_FORMAT,
  timezone?: number,
) => {
  if (!dateObject) return '';

  let d = dayjs(dateObject);
  if (timezone) {
    d = d.subtract(Math.abs(timezone), 'hour');
  }

  return d.format(format);
};
