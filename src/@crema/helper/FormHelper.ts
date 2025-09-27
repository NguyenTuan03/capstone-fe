import { FormInstance } from 'antd/lib/form/Form';
export const handleErrorValidate = (form: FormInstance, error: any) => {
  const errors = error?.response?.data?.errorMessageArray;
  if (errors && Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([key, value]) => {
      form.setFields([{ name: key, errors: [value as string] }]);
    });
  }
};

/**
 * Generic helpers for DynamicSpecField (reusable)
 */

export interface DynamicFieldItem {
  name: string;
  specId?: number | string;
  outputName?: string;
  idKey?: string;
  valueKey?: string;
  pivotValueKey?: string;
}

const extractIdFromName = (name: string): string | number | undefined => {
  const m = /.*_(\d+)$/.exec(name || '');
  return m ? Number(m[1]) : undefined;
};

/**
 * Convert a group of DynamicSpecField(s) to API array
 */
export const convertDynamicFieldsGroupToApiData = (
  values: any,
  fields: DynamicFieldItem[],
  idKey = 'id',
  valueKey = 'value',
) => {
  if (!values || !Array.isArray(fields) || !fields.length) return [];

  const arr: any[] = [];
  fields.forEach((f) => {
    const val = values[f.name];
    if (val !== undefined && val !== null && val !== '') {
      const id = f.specId ?? extractIdFromName(f.name);
      if (id !== undefined) {
        arr.push({
          [idKey]: id,
          [valueKey]: Number(val),
        });
      }
    }
  });
  return arr;
};

/**
 * Map API array back to form fields for editing
 */
export const applyApiDataToDynamicFields = (
  apiArray: any[],
  fields: DynamicFieldItem[],
  idKey = 'id',
  valueKey = 'value',
) => {
  const result: Record<string, any> = {};
  if (!Array.isArray(apiArray) || !Array.isArray(fields)) return result;

  const mapById = new Map<any, any>();
  apiArray.forEach((item) => mapById.set(item?.[idKey], item));

  fields.forEach((f) => {
    const id = f.specId ?? extractIdFromName(f.name);
    const hit = id !== undefined ? mapById.get(id) : undefined;

    if (hit) {
      if (hit[valueKey] !== undefined) {
        result[f.name] = hit[valueKey];
      } else {
        result[f.name] = null;
      }
    } else {
      result[f.name] = null;
    }
  });

  return result;
};
