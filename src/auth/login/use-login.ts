import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { axiosInstance } from '@/api/axios-instance';
import { handleAxiosError } from '@/lib/handle-api-error';
import { useAuthStore } from '@/store/auth-store';

import { type TLoginSchema } from './login-schema';

export const useLogin = () => {
  const { setToken } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const login = async (values: TLoginSchema) => {
    try {
      const response = await axiosInstance.post('/auth/login', values, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // To allow cookies to be sent with the request
      });

      setToken(response.data.data.accessToken);

      navigate(from);
    } catch (error) {
      const { errorMessage } = handleAxiosError(error, 'Failed to login');
      toast.error(errorMessage);
    }
  };

  return { login };
};
