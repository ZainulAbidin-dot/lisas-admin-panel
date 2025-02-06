import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function PasswordUpdateForm() {
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <PasswordInput label="Current Password" name="currentPassword" />
        <PasswordInput label="New Password" name="newPassword" />
        <PasswordInput label="Confirm Password" name="confirmPassword" />
        <Button type="submit" className="w-full">
          Update Password
        </Button>
      </form>
    </Form>
  );
}

function PasswordInput({ label, name }: { label: string; name: string }) {
  const [visible, setVisible] = useState(false);
  const form = useFormContext();

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            type={visible ? 'text' : 'password'}
            {...form.register(name)}
            className="pr-10"
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
      <FormMessage>
        {form.formState.errors[name]?.message as string}
      </FormMessage>
    </FormItem>
  );
}
