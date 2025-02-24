import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { axiosInstance } from '@/api/axios-instance';
import { ButtonWithLoader } from '@/components/composed/button-with-loader';
import { Footer } from '@/components/shared/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { handleAxiosError } from '@/lib/handle-api-error';

import { GuestNav } from '../_components/guest-nav';

const requestPasswordResetSchema = z.object({
  email: z.string().email(),
});

type TRequestPasswordReset = z.infer<typeof requestPasswordResetSchema>;

export function RequestPasswordReset() {
  const form = useForm<TRequestPasswordReset>({
    resolver: zodResolver(requestPasswordResetSchema),
  });

  const handleSubmit = async (data: TRequestPasswordReset) => {
    try {
      const response = await axiosInstance.post(
        '/auth/request-password-reset',
        data
      );

      console.log(response.data);

      toast.success(response.data.message);
    } catch (error) {
      const { errorMessage } = handleAxiosError(
        error,
        'Failed to send reset link'
      );
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-dvh flex-col">
      <GuestNav />

      <main className="flex flex-grow items-center justify-center px-4">
        <Card className="mx-auto w-full max-w-5xl rounded-lg bg-white p-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-center text-sm text-gray-500">
              Enter your email address to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your email"
                            className="mt-1 bg-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ButtonWithLoader
                    className="w-full"
                    type="submit"
                    isLoading={form.formState.isSubmitting}
                    initialText="Send Reset Link"
                    loadingText="Sending Reset Link"
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
