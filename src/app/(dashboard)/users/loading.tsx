import AppLoader from '@/@crema/components/AppLoader';

export default function UsersLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AppLoader />
    </div>
  );
}
