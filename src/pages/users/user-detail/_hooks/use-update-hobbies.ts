import React from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

export type TUpdateHobbies = {
  hobbies: string[];
};

export function useUpdateHobbies() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const axiosInstance = useAxiosPrivate();

  const updateHobbies = async (values: TUpdateHobbies) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put('/profile/me/hobbies', values);
      console.log('Update Hobbies Response: ', response.data);
      toast.success('Hobbies updated successfully');
    } catch (error) {
      console.error('Update Hobbies Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateHobbies, isSubmitting };
}
