import { useState } from 'react';

import { Trash2Icon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';
import { ButtonWithLoader } from '@/components/composed/button-with-loader';
import { LoadingState } from '@/components/loading-state';
import ToggleButton from '@/components/toggle-button';
import { useAxiosDelete } from '@/hooks/use-axios-delete';
import { useAxiosGet } from '@/hooks/use-axios-get';
import { handleAxiosError } from '@/lib/handle-api-error';

import { UpdatePersonalInfo } from './_components/personal-info';
import { UpdateProfileInformation } from './_components/profile-information';
import { ProfilePictureManager } from './_components/profile-pictures';
import { UpdateAddress } from './_components/user-address';
import { UpdateHobbies } from './_components/user-hobbies';

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

const getUserDetailSchema = z.object({
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

type TGetUserDetailSchema = z.infer<typeof getUserDetailSchema>;

export function UserDetail() {
  const { id } = useParams();
  const [isUpdating, setIsUpdating] = useState(false);

  const { isDeleting, deleteFn } = useAxiosDelete({
    url: `/admin/users/${id}`,
    showSnackbarOnSuccess: false,
  });

  const { data, setData, isLoading } = useAxiosGet<TGetUserDetailSchema>({
    url: `/admin/users/${id}`,
    validationSchema: getUserDetailSchema,
    initialData: null,
  });

  const axios = useAxiosPrivate();

  if (!id) return null;

  const onChangeVerificationStatus = async () => {
    if (!data?.data.profileData) return;

    try {
      setIsUpdating(true);

      await axios.patch(`/admin/users/${id}/verification-status`, {
        status: data.data.profileData.isVerified ? false : true,
        userId: id,
      });

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          data: {
            ...prev.data,
            profileData: {
              ...prev.data.profileData,
              isVerified: prev.data.profileData.isVerified ? false : true,
            },
          },
        };
      });
    } catch (error) {
      const { errorMessage } = handleAxiosError(error);

      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <LoadingState />;

  if (!data || !data.data) {
    return <div className="p-4 text-center text-gray-600">User not found</div>;
  }

  const user = data.data;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="mx-auto w-full max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {user.personalData.firstName} {user.personalData.lastName}
            </h1>
          </div>

          <div className="m-auto flex items-center gap-8">
            <ButtonWithLoader
              variant="destructive"
              initialText="Delete"
              isLoading={isDeleting}
              loadingText="Deleting"
              initialIcon={<Trash2Icon />}
              onClick={() => deleteFn()}
            />

            <ToggleButton
              isVerified={user.profileData.isVerified}
              updating={isUpdating}
              onChangeVerificationStatus={onChangeVerificationStatus}
            />
          </div>

          <ProfilePictureManager initialImages={user.profilePics} userId={id} />

          <UpdatePersonalInfo personalInfo={user.personalData} />

          <UpdateAddress address={user.address} />

          <UpdateProfileInformation userProfile={user.profileData} />

          <UpdateHobbies hobbies={user.hobbies} />
        </div>
      </div>
    </div>
  );
}
