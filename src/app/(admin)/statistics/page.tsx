import { buildMetadata } from '@/@crema/helper/seo';
import StatisticsPage from '@/modules/dashboard/statistics';

export const metadata = buildMetadata({
  title: 'Thống kê 3D Interactive',
  description:
    'Dashboard thống kê với biểu đồ 3D interactive - Phân tích dữ liệu người dùng, sessions, doanh thu với công nghệ Three.js',
  path: '/statistics',
});

export default function StatisticsPageRoute() {
  return <StatisticsPage />;
}
