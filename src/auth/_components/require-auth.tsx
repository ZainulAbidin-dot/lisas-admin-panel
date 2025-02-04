import { useEffect } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';
import { useAuthStore } from '@/store/auth-store';

const RequireAuth = () => {
  const { token } = useAuthStore();

  console.log('RequireAuth', token);

  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  //! ONLY FOR TESTING
  useEffect(() => {
    const controller = new AbortController();

    axiosPrivate('/protected', { signal: controller.signal }).catch();

    return () => {
      controller.abort();
    };
  }, [axiosPrivate]);

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
