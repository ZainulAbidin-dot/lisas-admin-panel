import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/store/auth-store';

const RequireAuth = () => {
  const { token } = useAuthStore();

  console.log('RequireAuth', token);

  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
