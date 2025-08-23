'use client';
import { useEffect } from 'react';
import { Button } from 'antd';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Đã xảy ra lỗi!</h2>
      <Button onClick={() => reset()}>Thử lại</Button>
    </div>
  );
}
