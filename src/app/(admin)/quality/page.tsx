import { buildMetadata } from '@/@crema/helper/seo';
import QualityPageClient from '@/modules/dashboard/quality';

export const metadata = buildMetadata({
  title: 'Giám sát chất lượng huấn luyện viên',
  description: 'Giám sát chất lượng huấn luyện viên - Đánh giá, phản hồi, báo cáo chất lượng',
  path: '/quality',
});

export default function QualityPage() {
  return <QualityPageClient />;
}
