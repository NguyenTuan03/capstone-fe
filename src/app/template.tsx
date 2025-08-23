'use client';
import { Suspense, useState, useEffect } from 'react';
import Loading from '@/app/loading';

export default function Template({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loading />;
  }

  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
