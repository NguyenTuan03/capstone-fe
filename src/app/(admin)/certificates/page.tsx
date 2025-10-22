import { buildMetadata } from '@/@crema/helper/seo';
import CertificatesPageClient from '@/modules/dashboard/certificates';

export const metadata = buildMetadata({
  title: 'Xác minh chứng chỉ',
  description: 'Xác minh chứng chỉ - Duyệt chứng chỉ huấn luyện viên, quản lý giấy phép',
  path: '/certificates',
});

export default function CertificatesPage() {
  return <CertificatesPageClient />;
}
