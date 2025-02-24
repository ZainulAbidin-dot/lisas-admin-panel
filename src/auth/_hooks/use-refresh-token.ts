import { axiosInstance } from '@/api/axios-instance';
import { handleAxiosError } from '@/lib/handle-api-error';
import { useAuthStore } from '@/store/auth-store';

export const useRefreshToken = () => {
  const { setToken } = useAuthStore();

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

      console.log(errorMessage);
    }
  };
  return refresh;
};
