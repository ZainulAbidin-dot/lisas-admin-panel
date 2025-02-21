import { InputHTMLAttributes, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm, useFormContext } from 'react-hook-form';

import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import {
  TUpdatePassword,
  updatePasswordSchema,
  useUpdatePassword,
} from './_hooks/use-update-password';

export function UpdatePassword() {
  const form = useForm({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { updatePassword } = useUpdatePassword();

  return (
    <Card className="p-6 bg-transparent shadow-sm">
      <h2 className="text-3xl font-bold mb-2">Change password</h2>
      <p className="text-gray-500 text-sm">
        Update your password to keep your account secure.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(updatePassword)}>
          <CardContent className="grid grid-cols-1 gap-4 mt-4 px-0">
            <PasswordInput<TUpdatePassword>
              displayName="Old Password"
              nameInSchema="oldPassword"
              placeholder="Enter current password"
              autoComplete="current-password"
            />
            <PasswordInput<TUpdatePassword>
              displayName="New Password"
              nameInSchema="newPassword"
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            <PasswordInput<TUpdatePassword>
              displayName="Confirm Password"
              nameInSchema="confirmNewPassword"
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </CardContent>

        </form>
      </Form>
    </Card>
  );
}

function PasswordInput<S>({
  displayName,
  nameInSchema,
  placeholder,
  ...props
}: {
  displayName: string;
  nameInSchema: keyof S & string;
  placeholder: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={nameInSchema}>{displayName}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={visible ? 'text' : 'password'}
                className="pr-10 bg-transparent"
                id={nameInSchema}
                placeholder={placeholder}
                {...field}
                {...props}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center"
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
