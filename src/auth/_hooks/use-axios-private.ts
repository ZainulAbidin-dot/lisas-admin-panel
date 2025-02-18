import { useEffect } from 'react';

import { axiosPrivateInstance } from '@/api/axios-instance';
import { useRefreshToken } from '@/auth/_hooks/use-refresh-token';
import { useAuthStore } from '@/store/auth-store';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const token = useAuthStore((state) => state.token?.encoded);

  useEffect(() => {
    const requestIntercept = axiosPrivateInstance.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivateInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivateInstance(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivateInstance.interceptors.request.eject(requestIntercept);
      axiosPrivateInstance.interceptors.response.eject(responseIntercept);
    };
  }, [token, refresh]);

  return axiosPrivateInstance;
};

export default useAxiosPrivate;
