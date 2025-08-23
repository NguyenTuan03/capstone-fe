// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-semibold">404 – Không tìm thấy</h1>
      <p className="mt-2 text-gray-500">Trang bạn tìm không tồn tại.</p>
      <Link href="/" className="mt-4 inline-block underline">
        Về trang chủ
      </Link>
    </div>
  );
}
