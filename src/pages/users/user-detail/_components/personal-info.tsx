import { InputHTMLAttributes } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { cn } from '@/lib/utils';

import {
  type TUpdatePersonalInfo,
  updatePersonalInfoSchema,
} from '../_hooks/use-update-personal-information';

export function UpdatePersonalInfo({
  personalInfo,
}: {
  personalInfo: TUpdatePersonalInfo;
}) {
  const form = useForm({
    resolver: zodResolver(updatePersonalInfoSchema),
    defaultValues: personalInfo,
  });

  return (
    <Card className="bg-transparent p-6">
      <h2 className="mb-2 text-3xl font-bold">User Details</h2>
      <p className="text-sm text-gray-500">Personal information. (Read-Only)</p>

      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault() /** Prevent form submission */}
        >
          <CardContent className="mt-4 grid grid-cols-1 gap-4 px-0 md:grid-cols-2">
            <TextInputWithLabel<TUpdatePersonalInfo>
              nameInSchema="firstName"
              displayName="First Name"
              placeholder="Enter first name"
              type="text"
              readOnly
            />

            <TextInputWithLabel<TUpdatePersonalInfo>
              nameInSchema="lastName"
              displayName="Last Name"
              placeholder="Enter last name"
              type="text"
              readOnly
            />

            <TextInputWithLabel<TUpdatePersonalInfo>
              nameInSchema="email"
              displayName="Email"
              placeholder="Enter email"
              type="email"
              readOnly
            />

            <TextInputWithLabel<TUpdatePersonalInfo>
              nameInSchema="phoneNumber"
              displayName="Phone Number"
              placeholder="Enter number"
              type="text"
              readOnly
            />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}

function TextInputWithLabel<S>({
  displayName,
  nameInSchema,
  type,
  placeholder,
  className,
  labelClassName,
  ...props
}: {
  displayName: string;
  nameInSchema: keyof S & string;
  placeholder: string;
  type?: 'email' | 'text';
  className?: string;
  labelClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClassName} htmlFor={nameInSchema}>
            {displayName}
          </FormLabel>
          <FormControl>
            <Input
              className={cn('bg-transparent', className)}
              type={type || 'text'}
              id={nameInSchema}
              placeholder={placeholder}
              {...field}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
