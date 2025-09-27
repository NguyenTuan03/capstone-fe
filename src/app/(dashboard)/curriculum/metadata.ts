import { Metadata } from 'next';
import { buildMetadata } from '@/@crema/helper/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Quản lý chương trình giảng dạy',
    description: 'Quản lý chương trình giảng dạy và nội dung học tập',
    keywords: [
      'quản lý chương trình',
      'nội dung học tập',
      'chương học',
      'bài học',
      'quiz',
      'giảng dạy',
      'pickleball',
    ],
  });
}
