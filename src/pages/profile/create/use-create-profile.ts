import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';
import { useAuthStore } from '@/store/auth-store';

export const useCreateProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  const createProfile = async (values: Record<string, string>) => {
    try {
      const response = await axiosPrivate.post('/profile/create', values);
      console.log('Create Profile Response', response.data);
      toast.success('Profile created successfully');

      setToken(response.data.data.accessToken);
      navigate('/');
    } catch (error) {
      console.error('Create Profile Error', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    }
  };

  return { createProfile };
};
