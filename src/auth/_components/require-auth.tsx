import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { AppLayout } from '@/components/shared/app-layout';
import { useAuthStore } from '@/store/auth-store';

const RequireAuth = ({
  requireSubscription,
}: {
  requireSubscription: boolean;
}) => {
  const { token } = useAuthStore();

  const location = useLocation();

  const userHasSubscription = token?.decoded.hasActiveSubscription;

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // User has token and page doesnot require subscription
  if (!requireSubscription) {
    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    );
  }

  // user has token, page require subscription and user doesnot have one
  if (!userHasSubscription) {
    return <Navigate to="/subscription" />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default RequireAuth;
