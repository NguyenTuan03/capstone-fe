import { Metadata } from 'next';
import { buildMetadata } from '@/@crema/helper/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Quản lý chương trình giảng dạy',
    description: 'Quản lý chương trình giảng dạy và nội dung học tập',
  });
}
