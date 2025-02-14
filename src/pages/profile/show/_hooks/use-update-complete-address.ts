import React from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

export const updateCompleteAddressSchema = z.object({
  streetAddress: z.string().nonempty('Street address is required'),
  city: z.string().nonempty('City is required'),
  country: z.string().nonempty('Country is required'),
  zipCode: z.string().nonempty('Zip code is required'),
});

export type TUpdateCompleteAddress = z.infer<
  typeof updateCompleteAddressSchema
>;

export function useUpdateCompleteAddress() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const axiosInstance = useAxiosPrivate();

  const updateCompleteAddress = async (values: TUpdateCompleteAddress) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put(
        '/profile/me/personal-data',
        values
      );
      console.log('Update Complete Address Response: ', response.data);
      toast.success('Complete Address updated successfully');
    } catch (error) {
      console.error('Update Complete Address Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateCompleteAddress, isSubmitting };
}
