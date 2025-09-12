import { NextRouter } from 'next/router';
import { removeItemInvalidFromObject } from './Common';

export const formatQueryParams = (queryParams: Record<string, any>) => {
  return Object.entries(queryParams).reduce(
    (acc, [key, value]) => {
      acc[key] = value;

      if (typeof value !== 'string') {
        return acc;
      }

      // Handle boolean values
      if (value === 'true') {
        acc[key] = true;
        return acc;
      }
      if (value === 'false') {
        acc[key] = false;
        return acc;
      }

      if (value.startsWith('[') || value.startsWith('{')) {
        try {
          acc[key] = JSON.parse(value);
        } catch {
          acc[key] = value;
        }
        return acc;
      }

      return acc;
    },
    {} as Record<string, any>,
  );
};

export const updateUrlQuery = (
  router: NextRouter,
  page?: number,
  pageSize?: number,
  params: any = {},
) => {
  /**
   * Processes a query value, converting arrays and objects to comma-separated strings
   * @param value The value to process
   * @returns Processed value as a string
   */
  const processQueryValue = (value: any) => {
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(Object.values(value));
    }
    return value;
  };

  const queryParams = Object.entries(
    removeItemInvalidFromObject({
      page,
      limit: pageSize,
      ...params,
    }),
  ).reduce(
    (acc, [key, value]) => {
      acc[key] = processQueryValue(value);
      return acc;
    },
    {} as Record<string, any>,
  );

  router.push(
    {
      pathname: router.pathname,
      query: queryParams,
    },
    undefined,
    { shallow: true },
  );
};
