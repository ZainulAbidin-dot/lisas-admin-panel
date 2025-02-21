import React from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

export const updatePersonalInfoSchema = z.object({
  id: z.string().min(1, 'Id is required'),
  name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  subscriptionType: z.string().min(1, 'Last name is required'),
  currentStatus: z.string().min(1, 'Last name is required'),
  totalSpent: z.string().min(1, 'Last name is required'),
});

export type TUpdatePersonalInfo = z.infer<typeof updatePersonalInfoSchema>;

export function useUpdatePersonalInformation() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const axiosInstance = useAxiosPrivate();

  const updatePersonalInformation = async (values: TUpdatePersonalInfo) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put(
        '/profile/me/personal-data',
        values
      );
      console.log('Update Personal Information Response: ', response.data);
      toast.success('Personal information updated successfully');
    } catch (error) {
      console.error('Update Personal Information Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updatePersonalInformation, isSubmitting };
}
