import { buildMetadata } from '@/@crema/helper/seo';
import CourseVerificationPageClient from '@/modules/dashboard/course-verification';

export const metadata = buildMetadata({
  title: 'Xác minh khóa học',
  description: 'Xác minh khóa học - Duyệt khóa học mới, quản lý nội dung khóa học',
  path: '/course-verification',
});

export default function CourseVerificationPage() {
  return <CourseVerificationPageClient />;
}
