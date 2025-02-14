import React, { createContext, useContext } from 'react';
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
  profileImage?: string;
};

export type TPendingProfile = {
  id: string;
  name: string;
  age: number;
  city: string;
  profileImage?: string;
  senderId: string;
};

interface ProfileMatchContextType {
  isLoading: boolean;
  profileSuggestions: TProfileSuggestion[];
  pendingProfiles: TPendingProfile[];
  matchedProfiles: TMatchProfile[];
  handleRightSwipe: (userId: string) => void;
  handleLeftSwipe: (userId: string) => void;
  handleDeleteMatchRequest: (matchId: string) => Promise<void>;
  handleAcceptMatchRequest: (matchId: string) => Promise<void>;
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

  const {
    data: pendingProfiles,
    setData: setPendingProfiles,
    isLoading: isLoadingPendingMatches,
  } = useFetchData<TPendingProfile[]>('/profile/matches/pending-profiles');

  const { data: matchedProfiles, isLoading: isLoadingMatchedProfiles } =
    useFetchData<TMatchProfile[]>('/profile/matches/matched-profiles');

  const handleSwipe = async (userId: string, direction: 'right' | 'left') => {
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
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : `Error processing ${direction} swipe`;
      toast.error(errorMessage);
    }
  };

  const handleDeleteMatchRequest = async (matchId: string) => {
    try {
      const response = await axiosInstance.delete(`/profile/matches/requests`, {
        data: {
          matchId,
        },
      });
      setPendingProfiles((prev) => prev!.filter((p) => p.id !== matchId));
      toast.success(response.data.message);
    } catch (error) {
      console.error('Delete Match Request Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    }
  };

  const handleAcceptMatchRequest = async (matchId: string) => {
    try {
      const response = await axiosInstance.post(
        `/profile/matches/requests/accept`,
        {
          matchId,
        }
      );

      setPendingProfiles((prev) => prev!.filter((p) => p.id !== matchId));

      toast.success(response.data.message);
    } catch (error) {
      console.error('Accept Match Request Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    }
  };

  const isLoading =
    isLoadingSuggestions || isLoadingPendingMatches || isLoadingMatchedProfiles;

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

    setIsLoading(true); // ✅ Set loading state BEFORE fetchData runs

    async function fetchData() {
      try {
        const response = await axiosPrivate.get(url, {
          signal: abortController.signal,
        });
        setData(response.data.data.profiles);
      } catch (error) {
        if (error instanceof Error && error.name !== 'CanceledError') {
          console.error('Fetch Error:', error);
          const errorMessage =
            error instanceof AxiosError
              ? error?.response?.data?.message ||
                error?.message ||
                'Unknown Error'
              : 'Unknown Error';
          toast.error(errorMessage);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false); // ✅ Only set loading to false if request wasn't aborted
        }
      }
    }

    fetchData();
    return () => {
      abortController.abort();
    };
  }, [axiosPrivate, url]);

  return { data, setData, isLoading };
}
