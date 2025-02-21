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
    <Card className="p-6 bg-transparent">
      <h2 className="text-3xl font-bold mb-2">Address</h2>
      <p className="text-gray-500 text-sm">Your complete address details.</p>

      <Form {...form}>
        <form>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-0">
            <TextInputWithLabel<TUpdateAddress>
              nameInSchema="address"
              displayName="Street Address"
              placeholder="Enter street address"
              type="text"
              disabled
            />

            <TextInputWithLabel<TUpdateAddress>
              nameInSchema="city"
              displayName="City"
              placeholder="Enter city"
              type="text"
              disabled
            />

            <TextInputWithLabel<TUpdateAddress>
              nameInSchema="zipCode"
              displayName="Zip Code"
              placeholder="Enter zip code"
              type="text"
              disabled
            />

            <TextInputWithLabel<TUpdateAddress>
              nameInSchema="country"
              displayName="Country"
              placeholder="Enter country"
              type="text"
              disabled
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
  disabled,
  ...props
}: {
  displayName: string;
  nameInSchema: keyof S & string;
  placeholder: string;
  type?: 'email' | 'text';
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
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
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
