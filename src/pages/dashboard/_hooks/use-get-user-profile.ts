import React from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

type PersonalData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type ProfileData = {
  meetingPreference: 'phone' | 'penpal' | 'chat';
  feelsLonely: 'yes' | 'no';
  chatFrequency:
    | 'multiple-times-a-week'
    | 'once-a-week'
    | 'once-a-month'
    | 'once-every-three-months';
  age:
    | 'under-18'
    | '18-24'
    | '25-34'
    | '35-44'
    | '45-54'
    | '55-64'
    | '65-or-older';
  selfDescription: string;
  discussionTopics: string;
  friendExpectations: string;
  idVerification?: string | undefined;
};

type ProfilePic = {
  id: string;
  url: string;
};

type Address = {
  address: string;
  city: string;
  country: string;
  zipCode: string;
};

type User = {
  personalData: PersonalData;
  profileData: ProfileData;
  profilePics: ProfilePic[];
  address: Address;
  hobbies: string[];
};

export function useGetUserProfile() {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const axiosInstance = useAxiosPrivate();

  const getUserProfile = React.useCallback(
    (abortController: AbortController) => {
      setIsLoading(true);
      axiosInstance
        .get('/profile/me', {
          signal: abortController.signal,
        })
        .then((response) => {
          if (response.data.data) {
            setUser(response.data.data);
            toast.success(response.data.message);
          } else {
            throw new Error(`Response format is not valid`);
          }
        })
        .catch((error) => {
          if (error instanceof Error) {
            if (error.name !== 'CanceledError') {
              console.log(error);
              const errorMessage =
                error instanceof AxiosError
                  ? error?.response?.data?.message ||
                    error?.message ||
                    'Unknown Error'
                  : 'Unknown Error';
              toast.error(errorMessage);
              console.log(error);
            }
          } else {
            console.log(error);
            toast.error('Something went very wrong');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [axiosInstance]
  );

  React.useEffect(() => {
    const abortController = new AbortController();

    getUserProfile(abortController);

    return () => {
      abortController.abort();
    };
  }, [getUserProfile]);

  return { isLoading, user };
}
