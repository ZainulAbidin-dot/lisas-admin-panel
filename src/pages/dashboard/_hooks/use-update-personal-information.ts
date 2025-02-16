import React from 'react';

import { AxiosError } from 'axios';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { toast } from 'sonner';
import { z } from 'zod';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

export const updatePersonalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .refine(isPossiblePhoneNumber, { message: 'Invalid phone number' }),
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
