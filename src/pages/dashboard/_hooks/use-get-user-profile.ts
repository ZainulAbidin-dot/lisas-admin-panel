import { z } from 'zod';

import { useAxiosGet } from '@/hooks/use-axios-get';

const personalDataSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
});

const profileDataSchema = z
  .object({
    meetingPreference: z.enum(['phone', 'penpal', 'chat']),
    feelsLonely: z.enum(['yes', 'no']),
    chatFrequency: z.enum([
      'multiple-times-a-week',
      'once-a-week',
      'once-a-month',
      'once-every-three-months',
    ]),
    age: z.enum([
      'under-18',
      '18-24',
      '25-34',
      '35-44',
      '45-54',
      '55-64',
      '65-or-older',
    ]),
    selfDescription: z.string(),
    discussionTopics: z.string(),
    friendExpectations: z.string(),
    idVerification: z.string().nullable(),
    isVerified: z.boolean(),
  })
  .transform((data) => ({
    ...data,
    idVerification: data.idVerification ? data.idVerification : undefined,
  }));

const profilePicSchema = z.object({
  id: z.string(),
  url: z.string(),
});

const addressSchema = z.object({
  address: z.string(),
  city: z.string(),
  country: z.string(),
  zipCode: z.string(),
});

const hobbiesSchema = z.any().transform((value) => {
  if (typeof value === 'string') {
    return JSON.parse(value) as string[];
  }

  if (Array.isArray(value)) {
    return value as string[];
  }

  return [] as string[];
});

const getUserProfileSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    personalData: personalDataSchema,
    profileData: profileDataSchema,
    profilePics: z.array(profilePicSchema),
    address: addressSchema,
    hobbies: hobbiesSchema,
  }),
});
type UserProfileState = z.infer<typeof getUserProfileSchema>;

export function useGetUserProfile() {
  const { data: userProfileState, isLoading } = useAxiosGet<UserProfileState>({
    url: '/profile/me',
    validationSchema: getUserProfileSchema,
    initialData: null,
    showSnackbarOnSuccess: false,
  });

  return { isLoading, user: userProfileState?.data };
}
