import { buildMetadata } from '@/@crema/helper/seo';
import HomeClient from '@/modules/home';

export const metadata = buildMetadata({
  title: 'Trang chủ',
  description: 'Hệ thống quản lý pickle ball - Trang chủ',
});

export default function Home() {
  return <HomeClient />;
}
