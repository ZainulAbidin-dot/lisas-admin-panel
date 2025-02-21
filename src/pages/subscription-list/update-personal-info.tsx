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

  return (
    
    <Card className="p-6 bg-transparent">
      <h2 className="text-3xl font-bold mb-2">Subscription Details</h2>
      <p className="text-gray-500 text-sm">Personal information (Read-Only).</p>

      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault() /** Prevent form submission */}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-0">
          <TextInputWithLabel<TUpdatePersonalInfo>
            nameInSchema="id"
            displayName="ID"
            placeholder="Enter ID"
            type="text"
            value="12345" // Replace with dynamic value
            disabled
          />

          <TextInputWithLabel<TUpdatePersonalInfo>
            nameInSchema="name"
            displayName="Name"
            placeholder="Enter name"
            type="text"
            value="John Doe" // Replace with dynamic value
            disabled
          />

          <TextInputWithLabel<TUpdatePersonalInfo>
            nameInSchema="email"
            displayName="Email"
            placeholder="Enter email"
            type="email"
            value="john.doe@example.com" // Replace with dynamic value
            disabled
          />

          <TextInputWithLabel<TUpdatePersonalInfo>
            nameInSchema="subscriptionType"
            displayName="Subscription Type"
            placeholder="Enter subscription type"
            type="text"
            value="Premium" // Replace with dynamic value
            disabled
          />

          <TextInputWithLabel<TUpdatePersonalInfo>
            nameInSchema="currentStatus"
            displayName="Current Status"
            placeholder="Enter current status"
            type="text"
            value="Active" // Replace with dynamic value
            disabled
          />

          <TextInputWithLabel<TUpdatePersonalInfo>
            nameInSchema="totalSpent"
            displayName="Total Spent"
            placeholder="Enter total spent"
            type="text"
            value="$1000" // Replace with dynamic value
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
              disabled
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
