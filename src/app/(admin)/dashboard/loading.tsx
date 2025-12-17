import AppLoader from '@/@crema/components/AppLoader';

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <AppLoader />
    </div>
  );
}
