import React from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

export const updateAddressSchema = z.object({
  address: z.string().nonempty('Street address is required'),
  city: z.string().nonempty('City is required'),
  country: z.string().nonempty('Country is required'),
  zipCode: z.string().nonempty('Zip code is required'),
});

export type TUpdateAddress = z.infer<typeof updateAddressSchema>;

export function useUpdateAddress() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const axiosInstance = useAxiosPrivate();

  const updateAddress = async (values: TUpdateAddress) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put('/profile/me/address', values);
      console.log('Update Address Response: ', response.data);
      toast.success('Address updated successfully');
    } catch (error) {
      console.error('Update Address Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateAddress, isSubmitting };
}
