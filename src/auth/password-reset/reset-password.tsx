import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { axiosInstance } from '@/api/axios-instance';
import { ButtonWithLoader } from '@/components/composed/button-with-loader';
import { PasswordInput } from '@/components/composed/password-input';
import { Footer } from '@/components/shared/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { handleAxiosError } from '@/lib/handle-api-error';

import { GuestNav } from '../_components/guest-nav';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    email: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type TResetPassword = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const navigate = useNavigate();

  const form = useForm<TResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      email: email || '',
      token: token || '',
    },
  });

  const handleSubmit = async (data: TResetPassword) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', data);

      console.log(response.data);

      toast.success(response.data.message);

      navigate('/auth/login');
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
              Update Password
            </CardTitle>
            <CardDescription className="text-center text-sm text-gray-500">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <PasswordInput<TResetPassword>
                      displayName="Password"
                      nameInSchema="password"
                      placeholder="Enter your new password"
                    />
                    <PasswordInput<TResetPassword>
                      displayName="Confirm Password"
                      nameInSchema="confirmPassword"
                      placeholder="Confirm your new password"
                    />
                  </div>
                  <ButtonWithLoader
                    className="w-full"
                    type="submit"
                    isLoading={form.formState.isSubmitting}
                    initialText="Update Password"
                    loadingText="Updating Password"
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
