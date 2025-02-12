import React from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1), // no validations for old password.
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export type TUpdatePassword = z.infer<typeof updatePasswordSchema>;

export function useUpdatePassword() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const axiosInstance = useAxiosPrivate();

  const updatePassword = async (values: TUpdatePassword) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put('/profile/me/password', values);
      console.log('Update Password Response: ', response.data);
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Update Password Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updatePassword, isSubmitting };
}
