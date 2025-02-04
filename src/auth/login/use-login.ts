import { useLocation, useNavigate } from 'react-router-dom';

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
      const decodedToken = setToken(response.data.data.accessToken);
      if (decodedToken.profileId) {
        navigate(from);
      } else {
        navigate('/profile/create');
      }
    } catch (error) {
      console.error('Login Error: ', error);
    }
  };

  return { login };
};
