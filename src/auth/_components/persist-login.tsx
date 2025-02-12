import { useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';

import { useRefreshToken } from '@/auth/_hooks/use-refresh-token';
// import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuthStore } from '@/store/auth-store';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { token } = useAuthStore();
  // const [remember] = useLocalStorage('remember', false);
  const remember = true;

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

    // persist added here AFTER tutorial video
    // Avoids unwanted call to verifyRefreshToken
    if (!token && remember) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      abortController.abort();
      isMounted = false;
    };
  }, [remember, refresh, token]);

  return !remember ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />;
};

export default PersistLogin;
