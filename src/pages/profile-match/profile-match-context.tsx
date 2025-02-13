import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

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

interface ProfileMatchContextType {
  isLoading: boolean;
  profileSuggestions: TProfileSuggestion[];
  handleRightSwipe: (userId: string) => void;
  handleLeftSwipe: (userId: string) => void;
}

const ProfileMatchContext = createContext<ProfileMatchContextType | undefined>(
  undefined
);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ProfileMatchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [profileSuggestions, setProfileSuggestions] = useState<
    TProfileSuggestion[]
  >([]);
  const axiosInstance = useAxiosPrivate();

  const fetchProfiles = useCallback(
    (abortController: AbortController) => {
      setIsLoading(true);
      sleep(1000).then(() => {
        axiosInstance
          .get('/profile/matches/suggestions', {
            signal: abortController.signal,
          })
          .then((response) => {
            if (response.data.data.users) {
              setProfileSuggestions(response.data.data.users);
              toast.success(response.data.message);
            } else {
              throw new Error('Response format is not valid');
            }
          })
          .catch((error) => {
            if (error.name !== 'CanceledError') {
              console.log(error);
              const errorMessage =
                error instanceof AxiosError
                  ? error?.response?.data?.message ||
                    error?.message ||
                    'Unknown Error'
                  : 'Unknown Error';
              toast.error(errorMessage);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      });
    },
    [axiosInstance]
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchProfiles(abortController);
    return () => {
      abortController.abort();
    };
  }, [fetchProfiles]);

  const handleRightSwipe = useCallback(
    (userId: string) => {
      axiosInstance
        .post('/profile/matches/swipe-right', { userId })
        .then((response) => {
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || 'Error processing right swipe'
          );
        });
    },
    [axiosInstance]
  );

  const handleLeftSwipe = useCallback(
    (userId: string) => {
      axiosInstance
        .post('/profile/matches/swipe-left', { userId })
        .then((response) => {
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || 'Error processing left swipe'
          );
        });
    },
    [axiosInstance]
  );

  return (
    <ProfileMatchContext.Provider
      value={{
        isLoading,
        profileSuggestions,
        handleRightSwipe,
        handleLeftSwipe,
      }}
    >
      {children}
    </ProfileMatchContext.Provider>
  );
}

export function useProfileMatch() {
  const context = useContext(ProfileMatchContext);
  if (!context) {
    throw new Error(
      'useProfileMatch must be used within a ProfileMatchProvider'
    );
  }
  return context;
}
