import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/auth-store';
import { useState } from 'react';
import { axiosInstance } from '@/api/axios-instance';

export const useCreateProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  const createProfile = async (values: Record<string, string>) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post('/auth/register', values, {
        withCredentials: true,
      });
      console.log("Register response", response);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createProfile, isSubmitting };
};
