import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { axiosInstance } from '@/api/axios-instance';

import { TRegisterSchema } from './register-schema';

export const useRegister = () => {
  const navigate = useNavigate();

  const register = async (values: TRegisterSchema) => {
    try {
      const response = await axiosInstance.post('/auth/register', values);
      console.log('Register Response', response.data);
      toast.success('Account created successfully');
      navigate('/auth/login');
    } catch (error) {
      console.error('Register Error', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    }
  };

  return { register };
};
