import { InputHTMLAttributes, useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Link } from 'react-router-dom';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function PasswordInput<S>({
  displayName,
  nameInSchema,
  placeholder,
  showResetPassword = false,
  ...props
}: {
  displayName: string;
  nameInSchema: keyof S & string;
  placeholder: string;
  showResetPassword?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between gap-4">
            <FormLabel htmlFor={nameInSchema}>{displayName}</FormLabel>
            {showResetPassword ? (
              <Link to="/auth/request-password-reset" className="text-sm">
                Forgot password?
              </Link>
            ) : null}
          </div>
          <FormControl>
            <div className="relative">
              <Input
                type={visible ? 'text' : 'password'}
                className="bg-transparent pr-10"
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
