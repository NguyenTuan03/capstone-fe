import { buildMetadata } from '@/@crema/helper/seo';

export const metadata = buildMetadata({
  title: 'Đăng nhập',
  description: 'Đăng nhập vào hệ thống quản trị PICKLE-LEARN',
  path: '/signin',
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
