import React from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

export function useUpdateProfileImage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const axiosInstance = useAxiosPrivate();

  const updateProfileImage = async (image: string) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put('/profile/me/profile-image', {
        profileImage: image,
      });
      console.log('Update Profile Image Response: ', response.data);
      toast.success('Profile image updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Update Profile Image Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateProfileImage, isSubmitting };
}
