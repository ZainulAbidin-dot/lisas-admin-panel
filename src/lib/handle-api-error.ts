import { AxiosError } from 'axios';

export function handleAxiosError(
  error: unknown,
  defaultMessage: string = 'Something went wrong. Please try again'
) {
  if (error instanceof AxiosError) {
    const errorMessage =
      error.response?.data?.message || error?.message || defaultMessage;

    return {
      errorMessage,
      error,
    };
  }

  return {
    errorMessage: defaultMessage,
    error,
  };
}
