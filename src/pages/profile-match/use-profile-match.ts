import React, { useCallback } from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

export type TProfileSuggestion = {
  id: string;
  name: string;
  profileImageUrl?: string;
  email: string;
  phone: string;
  age: number;
  city: string;
};

export function useGetProfileMatchSuggestions() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileSuggestions, setProfileSuggestions] = React.useState<
    TProfileSuggestion[]
  >([]);

  const axiosInstance = useAxiosPrivate();

  const getProfiles = React.useCallback(
    (abortController: AbortController) => {
      setIsLoading(true);
      axiosInstance
        .get('/profile/matches/suggestions', {
          signal: abortController.signal,
        })
        .then((response) => {
          if (response.data.data.users) {
            setProfileSuggestions(response.data.data.users);
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

    getProfiles(abortController);

    return () => {
      abortController.abort();
    };
  }, [getProfiles]);

  return { isLoading, profileSuggestions };
}

export function useProfileCardSwap() {
  const axiosInstance = useAxiosPrivate();

  const handleRightSwipe = useCallback(
    (userId: string) => {
      axiosInstance
        .post('/profile/matches/swipe-right', { userId })
        .then((response) => {
          console.log(response);
          toast.success(response.data.message);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    },
    [axiosInstance]
  );
  const handleLeftSwipe = useCallback(
    (userId: string) => {
      axiosInstance
        .post('/profile/matches/swipe-left', { userId })
        .then((response) => {
          console.log(response);
          toast.success(response.data.message);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    },
    [axiosInstance]
  );

  return { handleRightSwipe, handleLeftSwipe };
}
