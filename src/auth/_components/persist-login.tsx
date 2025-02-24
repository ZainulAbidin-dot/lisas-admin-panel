import { useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';

import { useRefreshToken } from '@/auth/_hooks/use-refresh-token';
import { LoadingState } from '@/components/loading-state';
import { useAuthStore } from '@/store/auth-store';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { token } = useAuthStore();

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh(abortController);
      } catch (error) {
        if (error instanceof Error && error.name !== 'CanceledError') {
          console.log(error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        } else {
          console.log('Component is unmounted');
        }
      }
    };

    // Avoids unwanted call to verifyRefreshToken
    if (!token) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      abortController.abort();
      isMounted = false;
    };
  }, [refresh, token]);

  return isLoading ? <LoadingState /> : <Outlet />;
};

export default PersistLogin;
