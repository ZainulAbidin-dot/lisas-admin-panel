import { useEffect, useMemo, useState } from 'react';

import { AxiosError, AxiosInstance } from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

const baseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
});

export function useAxiosGet<R>({
  axios,
  url,
  schema,
}: {
  axios: AxiosInstance;
  url: string;
  schema: z.ZodSchema<R>;
}) {
  const [data, setData] = useState<R | null | undefined>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const responseSchema = useMemo(
    () => baseSchema.extend({ data: schema }),
    [schema]
  );

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await axios.get(url, {
          signal: abortController.signal,
        });
        const parsedData = responseSchema.parse(response.data);
        setData(parsedData.data);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== 'CanceledError') {
            setError(error);
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
          setError(new Error('Something went very wrong'));
          console.log(error);
          toast.error('Something went very wrong');
        }
        console.log('Error fetching data', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, axios, responseSchema]);

  return { data, error, isLoading };
}
