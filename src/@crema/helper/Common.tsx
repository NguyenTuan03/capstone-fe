import { ReactNode } from 'react';
import { IntlShape, useIntl } from 'react-intl';

// 'intl' service singleton reference
let intl: IntlShape;
export const IntlGlobalProvider = ({ children }: { children: ReactNode }): any => {
  intl = useIntl();
  // Keep the 'intl' service reference
  return children;
};
