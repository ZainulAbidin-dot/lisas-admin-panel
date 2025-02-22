import { useParams } from 'react-router-dom';
import { z } from 'zod';

import { LoadingState } from '@/components/loading-state';
import { useAxiosGet } from '@/hooks/use-axios-get';

import { ProfilePictureManager } from './profile-pictures-manager';
import { UpdateAddress } from './update-address';
import { UpdateHobbies } from './update-hobbies';
import { UpdatePersonalInfo } from './update-personal-info';
import { UpdateProfileInformation } from './update-profile-information';

const userDetailSchema = z.object({
  personalData: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
  }),

  profileData: z.object({
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
    idVerification: z
      .string()
      .nullable()
      .transform((val) => val || undefined),
  }),

  profilePics: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
    })
  ),

  address: z.object({
    address: z.string(),
    city: z.string(),
    country: z.string(),
    zipCode: z.string(),
  }),

  hobbies: z.array(z.string()),
});

const getUserDetailSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: userDetailSchema,
});

type TGetUserDetailSchema = z.infer<typeof getUserDetailSchema>;

export function UserDetail() {
  const { id } = useParams();

  const { data, isLoading } = useAxiosGet<TGetUserDetailSchema>({
    url: `/api/users/${id}`,
    validationSchema: getUserDetailSchema,
    initialData: null,
  });

  if (isLoading) return <LoadingState />;

  if (!data || !data.data) {
    return <div className="p-4 text-center text-gray-600">User not found</div>;
  }

  const user = data.data;

  return (
    <div className="w-full flex-grow">
      <div className="mx-auto w-full max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center"></div>

          <ProfilePictureManager initialImages={user.profilePics} />

          <UpdatePersonalInfo personalInfo={user.personalData} />

          <UpdateAddress address={user.address} />

          <UpdateProfileInformation userProfile={user.profileData} />

          <UpdateHobbies hobbies={user.hobbies} />
        </div>
      </div>
    </div>
  );
}
