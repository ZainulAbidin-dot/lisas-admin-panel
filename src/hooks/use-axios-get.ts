import React from 'react';

import { toast } from 'sonner';
import { z } from 'zod';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';
import { handleAxiosError } from '@/lib/handle-api-error';

export function useAxiosGet<T>({
  url,
  validationSchema,
  initialData,
  immediate = true,
  enabled = true,
  showSnackbarOnSuccess = false,
  showSnackbarOnError = false,
  onSuccess,
}: {
  url: string;
  validationSchema: z.ZodSchema;
  initialData: T | null;
  immediate?: boolean;
  enabled?: boolean;
  showSnackbarOnSuccess?: boolean;
  showSnackbarOnError?: boolean;
  onSuccess?: (data: T) => void;
}) {
  const axiosInstance = useAxiosPrivate();

  const [data, setData] = React.useState<T | null>(initialData);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(
    (abortController?: AbortController) => {
      setIsLoading(true);
      setError(null);

      axiosInstance
        .get(url, {
          signal: abortController?.signal,
        })
        .then(({ data }) => {
          if (showSnackbarOnSuccess) toast.success(data.message);

          const validatedData = validationSchema.safeParse(data);

          if (validatedData.success) {
            setData(validatedData.data);
            onSuccess?.(validatedData.data);
          } else {
            console.log(validatedData.error);
            setError("Data didn't match schema");
          }

          setIsLoading(false);
        })
        .catch((error) => {
          const { errorMessage } = handleAxiosError(
            error,
            `Failed to get ${url}`
          );

          setError(errorMessage);

          if (showSnackbarOnError) toast.error(errorMessage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [
      url,
      validationSchema,
      showSnackbarOnSuccess,
      showSnackbarOnError,
      axiosInstance,
      onSuccess,
    ]
  );

  React.useEffect(() => {
    const abortController = new AbortController();

    if (immediate && enabled) {
      fetchData(abortController);
    }

    return () => {
      abortController.abort();
    };
  }, [fetchData, immediate, enabled]);

  return {
    data,
    setData,
    isLoading,
    error,

    fetchFn: fetchData,
  };
}
