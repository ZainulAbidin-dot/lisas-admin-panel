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
  type TUpdateAddress,
  updateAddressSchema,
} from './_hooks/use-update-address';

export function UpdateAddress({ address }: { address: TUpdateAddress }) {
  const form = useForm({
    resolver: zodResolver(updateAddressSchema),
    defaultValues: address,
  });

  return (
    <Card className="bg-transparent p-6">
      <h2 className="mb-2 text-3xl font-bold">Address</h2>
      <p className="text-sm text-gray-500">
        Your complete address details. (Read Only)
      </p>

      <Form {...form}>
        <form>
          <CardContent className="mt-4 grid grid-cols-1 gap-4 px-0 md:grid-cols-2">
            <TextInputWithLabel<TUpdateAddress>
              nameInSchema="address"
              displayName="Street Address"
              placeholder="Enter street address"
              type="text"
              readOnly
            />

            <TextInputWithLabel<TUpdateAddress>
              nameInSchema="city"
              displayName="City"
              placeholder="Enter city"
              type="text"
              readOnly
            />

            <TextInputWithLabel<TUpdateAddress>
              nameInSchema="zipCode"
              displayName="Zip Code"
              placeholder="Enter zip code"
              type="text"
              readOnly
            />

            <TextInputWithLabel<TUpdateAddress>
              nameInSchema="country"
              displayName="Country"
              placeholder="Enter country"
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
