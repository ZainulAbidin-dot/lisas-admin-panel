import { axiosInstance } from '@/api/axios-instance';
import { useAuthStore } from '@/store/auth-store';

export const useLogout = () => {
  const { clearToken } = useAuthStore();

  const logout = async () => {
    clearToken();

    axiosInstance
      .post('/auth/logout', {
        withCredentials: true, // To allow cookies to be sent with the request
      })
      .catch((err) => {
        console.log('Logout Error: ', err);
      });
  };

  return logout;
};
