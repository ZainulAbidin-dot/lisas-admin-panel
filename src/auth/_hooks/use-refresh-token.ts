import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { axiosInstance } from '@/api/axios-instance';
import { handleAxiosError } from '@/lib/handle-api-error';
import { useAuthStore } from '@/store/auth-store';

export const useRefreshToken = () => {
  const { setToken, clearToken } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const refresh = async (controller?: AbortController) => {
    try {
      const response = await axiosInstance.get('/auth/refresh', {
        withCredentials: true, // To send the cookie
        signal: controller?.signal,
      });

      const accessToken = response.data.data.accessToken;

      setToken(accessToken);

      return accessToken;
    } catch (error) {
      const { errorMessage } = handleAxiosError(error);

      toast.error(errorMessage);

      clearToken();

      navigate('/auth/login', {
        replace: true,
        state: { from: location },
      });
    }
  };
  return refresh;
};
