import { AxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { axiosInstance } from '@/api/axios-instance';
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
      console.log('Login Response: ', response.data);
      setToken(response.data.data.accessToken);

      navigate(from);
    } catch (error) {
      console.error('Login Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    }
  };

  return { login };
};
