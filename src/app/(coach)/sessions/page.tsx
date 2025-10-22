import { metadata } from './metadata';
import SessionsPage from '@/modules/dashboard/sessions';

export { metadata };

export default function SessionsPageWrapper() {
  return <SessionsPage />;
}
