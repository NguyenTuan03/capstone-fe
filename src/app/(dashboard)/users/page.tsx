import { metadata } from './metadata';
import UsersPageClient from '@/modules/dashboard/users';

export { metadata };

export default function UsersPage() {
  return <UsersPageClient />;
}
