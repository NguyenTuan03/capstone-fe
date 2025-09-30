import { buildMetadata } from '@/@crema/helper/seo';
import AchievementManagement from '@/modules/dashboard/achievements';

export const metadata = buildMetadata({
  title: 'Quản lý Thành tựu',
  description:
    'Hệ thống gamification - Tạo và quản lý achievements để tăng động lực học tập cho người dùng',
  path: '/achievements',
});

export default function AchievementsPage() {
  return <AchievementManagement />;
}
