import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/use-local-storage';

import { loginSchema } from './login-schema';
import { useLogin } from './use-login';

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = useLocalStorage('remember', false);
  const { login } = useLogin();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: remember,
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const isError = Boolean(
    form.formState.errors.email || form.formState.errors.password
  );

  return (
    <React.Fragment>
      <h1 className="text-4xl font-bold text-gray-900">Lisa's Friend</h1>
      <p className="mt-2 text-gray-600 text-xl">Welcome back.</p>
      <Form {...form}>
        <form className="my-6" onSubmit={form.handleSubmit(login)}>
          <div className="flex flex-col space-y-4">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="mt-1 bg-transparent pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-stretch gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => {
                        setRemember(value === true);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="">Remember me</FormLabel>
                </FormItem>
              )}
            />
            <Button
              data-variant="secondary"
              variant="default"
              className="mt-6 w-full items-center justify-center gap-2"
              type="submit"
              disabled={isSubmitting || isError}
            >
              <ArrowRight size={18} />
              <span>Sign In</span>
            </Button>
          </div>
        </form>
      </Form>
      <p className="mt-4 text-center text-gray-700">
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="text-primary"
          data-variant="secondary"
        >
          Sign up
        </Link>
      </p>
    </React.Fragment>
  );
}
