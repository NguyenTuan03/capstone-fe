import AppPage from '@/@crema/components/AppPage';
import React from 'react';
import { useIntl } from 'react-intl';
import { Columns } from './columns';
import { Fields } from './fields';
import useBreakpoint from 'use-breakpoint';

const UserPage = () => {
  const { messages: t } = useIntl();
  const { breakpoint } = useBreakpoint({ tablet: 1024, mobile: 768 });
  const isTableOrMobile = breakpoint === 'tablet' || breakpoint === 'mobile';

  return (
    <div>
      <h1>UserPage</h1>
      <AppPage
        title={t['users.title'] as string}
        endpoint="/api/users"
        showAddButton
        columns={Columns}
        fields={Fields({ t })}
        scrollX={isTableOrMobile ? 'calc(200px + 100%)' : 'calc(100%)'}
      />
    </div>
  );
};

export default UserPage;
