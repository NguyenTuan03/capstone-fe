'use client';

import React from 'react';
import SessionsPageClient from './SessionsPageClient';
import SessionsTable from './SessionsTable';
import SessionModals from './SessionModals';

const SessionsPage: React.FC = () => {
  const sessionData = SessionsPageClient();

  return (
    <div style={{ padding: '24px' }}>
      <SessionsTable {...sessionData} />
      <SessionModals {...sessionData} />
    </div>
  );
};

export default SessionsPage;
