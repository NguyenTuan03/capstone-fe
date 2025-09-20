import AppLoader from '@/@crema/components/AppLoader';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-96">
      <AppLoader />
    </div>
  );
}
