import React from 'react';

import { toast } from 'sonner';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';
import { handleAxiosError } from '@/lib/handle-api-error';

export function useAxiosDelete({
  url,
  showSnackbarOnSuccess = false,
  showSnackbarOnError = false,
}: {
  url: string;

  showSnackbarOnSuccess?: boolean;
  showSnackbarOnError?: boolean;
}) {
  const axiosInstance = useAxiosPrivate();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const deleteFn = React.useCallback(
    (abortController?: AbortController) => {
      setIsDeleting(true);
      setError(null);

      return axiosInstance
        .delete(url, {
          signal: abortController?.signal,
        })
        .then(({ data }) => {
          if (showSnackbarOnSuccess && data.message) {
            toast.success(data.message);
          }

          setIsDeleting(false);

          return true;
        })
        .catch((error) => {
          const { errorMessage } = handleAxiosError(
            error,
            `Failed to delete ${url}`
          );

          setError(errorMessage);

          if (showSnackbarOnError) {
            toast.error(errorMessage);
          }

          return false;
        })
        .finally(() => {
          setIsDeleting(false);
        });
    },
    [url, showSnackbarOnSuccess, showSnackbarOnError, axiosInstance]
  );

  return {
    isDeleting,
    error,
    deleteFn,
  };
}
