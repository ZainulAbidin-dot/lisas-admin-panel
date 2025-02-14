import React, { createContext, useCallback, useContext } from 'react';
import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';

export type TProfileSuggestion = {
  id: string;
  name: string;
  age: number;
  city: string;
  profileImages?: string[];
};

export type TMatchProfile = {
  id: string;
  name: string;
  age: number;
  city: string;
  email: string;
  phone: string;
  profileImage: string;
};

export type TPendingProfile = {
  id: string;
  name: string;
  age: number;
  city: string;
  profileImage: string;
  senderId: string;
};

interface ProfileMatchContextType {
  isLoading: boolean;
  profileSuggestions: TProfileSuggestion[];
  pendingProfiles: TPendingProfile[];
  matchedProfiles: TMatchProfile[];
  handleRightSwipe: (userId: string) => void;
  handleLeftSwipe: (userId: string) => void;
  handleDeleteMatchRequest: (matchId: string) => void;
  handleAcceptMatchRequest: (matchId: string) => void;
}

const ProfileMatchContext = createContext<ProfileMatchContextType | undefined>(
  undefined
);

export function ProfileMatchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const axiosInstance = useAxiosPrivate();

  const { data: profileSuggestions, isLoading: isLoadingSuggestions } =
    useFetchData<TProfileSuggestion[]>('/profile/matches/suggestions');
  const { data: pendingProfiles, isLoading: isLoadingPendingMatches } =
    useFetchData<TPendingProfile[]>('/profile/matches/pending-profiles');
  const { data: matchedProfiles, isLoading: isLoadingMatchedProfiles } =
    useFetchData<TMatchProfile[]>('/profile/matches/matched-profiles');

  const handleSwipe = useCallback(
    async (userId: string, direction: 'right' | 'left') => {
      try {
        const response = await axiosInstance.post(
          `/profile/matches/swipe-${direction}`,
          { userId }
        );
        toast.success(response.data.message);
      } catch (error) {
        console.error('Swipe Error: ', error);
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Unknown Error'
            : `Error processing ${direction} swipe`;
        toast.error(errorMessage);
      }
    },
    [axiosInstance]
  );

  const handleDeleteMatchRequest = useCallback(
    async (matchId: string) => {
      try {
        const response = await axiosInstance.delete(
          `/profile/matches/requests`,
          {
            data: {
              matchId,
            },
          }
        );
        toast.success(response.data.message);
      } catch (error) {
        console.error('Delete Match Request Error: ', error);
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Unknown Error'
            : 'Unknown Error';
        toast.error(errorMessage);
      }
    },
    [axiosInstance]
  );

  const handleAcceptMatchRequest = useCallback(
    async (matchId: string) => {
      try {
        const response = await axiosInstance.post(
          `/profile/matches/requests/accept`,
          {
            matchId,
          }
        );
        toast.success(response.data.message);
      } catch (error) {
        console.error('Accept Match Request Error: ', error);
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Unknown Error'
            : 'Unknown Error';
        toast.error(errorMessage);
      }
    },
    [axiosInstance]
  );

  const isLoading =
    isLoadingSuggestions || isLoadingPendingMatches || isLoadingMatchedProfiles;

  console.log(profileSuggestions);
  console.log(pendingProfiles);
  console.log(matchedProfiles);

  return (
    <ProfileMatchContext.Provider
      value={{
        isLoading,
        profileSuggestions: profileSuggestions || [],
        pendingProfiles: pendingProfiles || [],
        matchedProfiles: matchedProfiles || [],
        handleRightSwipe: (userId) => handleSwipe(userId, 'right'),
        handleLeftSwipe: (userId) => handleSwipe(userId, 'left'),
        handleDeleteMatchRequest,
        handleAcceptMatchRequest,
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

// HELPER HOOKS
function useFetchData<T>(url: string) {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(url, {
          signal: abortController.signal,
        });
        setData(response.data.data.profiles);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== 'CanceledError') {
            console.error('Login Error: ', error);
            const errorMessage =
              error instanceof AxiosError
                ? error?.response?.data?.message ||
                  error?.message ||
                  'Unknown Error'
                : 'Unknown Error';
            toast.error(errorMessage);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      abortController.abort();
    };
  }, [axiosPrivate, url]);

  return { data, isLoading };
}
