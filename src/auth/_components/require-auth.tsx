import { LogOutIcon } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { AppLayout } from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

import { useLogout } from '../_hooks/use-logout';

const RequireAuth = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useLogout();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (token.decoded.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="space-y-2 rounded-lg bg-white p-6 text-center shadow-lg">
          <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            This page is for admins only. Please contact support if you believe
            this is a mistake.
          </p>
          <Button variant="ghost" onClick={logout} title="Logout">
            <LogOutIcon />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default RequireAuth;
