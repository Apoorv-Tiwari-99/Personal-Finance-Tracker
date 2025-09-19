import ProtectedRoute from '@/components/auth/protected-route';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-6 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}