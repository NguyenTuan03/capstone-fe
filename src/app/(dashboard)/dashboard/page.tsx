import { buildMetadata } from '@/@crema/helper/seo';
import DashboardClient from '@/modules/dashboard/dashboard';

export const metadata = buildMetadata({
  title: 'Dashboard',
  description: 'Trang tổng quan hệ thống quản lý pickle ball',
});

export default function DashboardPage() {
  return <DashboardClient />;
}
