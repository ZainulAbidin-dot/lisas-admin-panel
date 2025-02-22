import { InputHTMLAttributes } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useForm, useFormContext } from 'react-hook-form';

import { PhoneNumberInput } from '@/components/composed/phone-input';
import { Button } from '@/components/ui/button';
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import {
  type TUpdatePersonalInfo,
  updatePersonalInfoSchema,
  useUpdatePersonalInformation,
} from './_hooks/use-update-personal-information';

export function UpdatePersonalInfo({
  personalInfo,
}: {
  personalInfo: TUpdatePersonalInfo;
}) {
  const form = useForm({
    resolver: zodResolver(updatePersonalInfoSchema),
    defaultValues: personalInfo,
  });

  const { updatePersonalInformation, isSubmitting } =
    useUpdatePersonalInformation();

  return (
    <Card className="bg-transparent p-6">
      <h2 className="mb-2 text-3xl font-bold">User Details</h2>
      <p className="text-sm text-gray-500">Update personal information.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(updatePersonalInformation)}>
          <CardContent className="mt-4 grid grid-cols-1 gap-4 px-0 md:grid-cols-2">
            <TextInputWithLabel<TUpdatePersonalInfo>
              nameInSchema="firstName"
              displayName="First Name"
              placeholder="Enter first name"
              type="text"
            />

            <TextInputWithLabel<TUpdatePersonalInfo>
              nameInSchema="lastName"
              displayName="Last Name"
              placeholder="Enter ast name"
              type="text"
            />

            <TextInputWithLabel<TUpdatePersonalInfo>
              nameInSchema="email"
              displayName="Email"
              placeholder="Enter email"
              type="email"
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <PhoneNumberInput
                      value={field.value}
                      onChange={(value) => field.onChange(value || '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <Separator />

          <div className="mt-4 flex justify-end">
            <Button type="submit" className="" disabled={isSubmitting}>
              <SaveIcon className="size-4" />
              Save
            </Button>
          </div>
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
