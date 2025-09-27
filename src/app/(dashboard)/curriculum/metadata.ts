import { Metadata } from 'next';
import { buildMetadata } from '@/@crema/helper/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleKey: 'curriculum.management.title',
    descriptionKey: 'curriculum.management.subtitle',
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
