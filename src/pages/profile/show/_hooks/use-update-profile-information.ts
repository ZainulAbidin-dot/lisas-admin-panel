import React from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

export const updateUserProfileSchema = z.object({
  meetingPreference: z.enum(['phone', 'penpal', 'chat']),
  feelsLonely: z.enum(['yes', 'no']),
  chatFrequency: z.enum([
    'multiple-times-a-week',
    'once-a-week',
    'once-a-month',
    'once-every-three-months',
  ]),
  city: z.string().min(1, 'City is required').max(50),
  age: z.enum([
    'under-18',
    '18-24',
    '25-34',
    '35-44',
    '45-54',
    '55-64',
    '65-or-older',
  ]),
  selfDescription: z.string().min(1, 'This field is required').max(255),
  discussionTopics: z.string().min(1, 'This field is required').max(255),
  friendExpectations: z.string().min(1, 'This field is required').max(255),
  idVerification: z
    .string()
    .refine((value) => {
      console.log('base64String: ', value);
      if (!value) return true;
      const matches = value.match(/^data:(.+);base64,(.+)$/);
      if (!matches || matches.length !== 3) return false;
      const mimeType = matches[1];
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(mimeType);
    }, 'Invalid image format')
    .optional(),
});

export type TUpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

export function useUpdateProfileInformation() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const axiosInstance = useAxiosPrivate();

  const updateProfileInformation = async (values: TUpdateUserProfile) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put(
        '/profile/me/profile-data',
        values
      );
      console.log('Update Profile Information Response: ', response.data);
      toast.success('Profile information updated successfully');
    } catch (error) {
      console.error('Update Profile Information Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateProfileInformation, isSubmitting };
}
