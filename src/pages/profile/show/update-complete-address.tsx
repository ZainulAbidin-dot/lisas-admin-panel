import { InputHTMLAttributes } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useForm, useFormContext } from 'react-hook-form';

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
  type TUpdateCompleteAddress,
  updateCompleteAddressSchema,
  useUpdateCompleteAddress,
} from './_hooks/use-update-complete-address';

export function UpdateCompleteAddress({
  completeAddress,
}: {
  completeAddress: TUpdateCompleteAddress;
}) {
  const form = useForm({
    resolver: zodResolver(updateCompleteAddressSchema),
    defaultValues: completeAddress,
  });

  const { updateCompleteAddress, isSubmitting } = useUpdateCompleteAddress();

  return (
    <Card className="p-6 bg-transparent">
      <h2 className="text-3xl font-bold mb-2">Complete Address</h2>
      <p className="text-gray-500 text-sm">update your complete address.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(updateCompleteAddress)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-0">
            <TextInputWithLabel<TUpdateCompleteAddress>
              nameInSchema="streetAddress"
              displayName="Sreet Address"
              placeholder="Enter street address"
              type="text"
            />

            <TextInputWithLabel<TUpdateCompleteAddress>
              nameInSchema="city"
              displayName="City"
              placeholder="Enter city"
              type="text"
            />

            <TextInputWithLabel<TUpdateCompleteAddress>
              nameInSchema="zipCode"
              displayName="Zip Code"
              placeholder="Enter zip code"
              type="text"
            />

            {/* Phone Number */}
            <TextInputWithLabel<TUpdateCompleteAddress>
              nameInSchema="country"
              displayName="Country"
              placeholder="Enter country"
              type="text"
            />
          </CardContent>

          <Separator />

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              className="hover:bg-[hsl(var(--primary-hover))]"
              disabled={isSubmitting}
            >
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
