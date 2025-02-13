import { useState } from 'react';

import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { axiosInstance } from '@/api/axios-instance';
import { useAuthStore } from '@/store/auth-store';

export const useCreateProfile = () => {
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const createProfile = async (values: Record<string, string>) => {
    try {
      setIsCreatingProfile(true);
      const response = await axiosInstance.post('/auth/register', values, {
        withCredentials: true,
      });
      console.log('Register response', response);
      setToken(response.data.data.accessToken);
      navigate('/');
      toast.success('Profile created successfully');
    } catch (error) {
      console.error('Create Profile Error', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const checkIsEmailTaken = async (email: string) => {
    try {
      setIsCheckingEmail(true);
      const response = await axiosInstance.post('/auth/is-email-taken', {
        email,
      });

      console.log('Check Email Response', response);

      return { emailTaken: false };
    } catch (error) {
      console.error('Check Email Error', error);
      return {
        emailTaken: true,
        message:
          error instanceof AxiosError ? error?.response?.data?.message : null,
      };
    } finally {
      setIsCheckingEmail(false);
    }
  };

  return {
    createProfile,
    checkIsEmailTaken,
    isCreatingProfile,
    isCheckingEmail,
  };
};
