import React, { forwardRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
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
import { cn } from '@/lib/utils';

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Enter a valid phone number'),
});

export default function PhoneForm() {
  const form = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: '+923048349985' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <PhoneNumberInput
          value={form.watch('phoneNumber')}
          onChange={(value) => form.setValue('phoneNumber', value || '')}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

function PhoneNumberInput({ value, onChange }: PhoneNumberInputProps) {
  return (
    <FormItem>
      <FormLabel>Phone Number</FormLabel>
      <div className="flex gap-2">
        <FormControl>
          <PhoneInput
            international
            value={value}
            onChange={onChange}
            inputComponent={InputComponent}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </FormControl>
      </div>
      <FormMessage />
    </FormItem>
  );
}

const InputComponent = forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => (
  <Input
    className={cn('rounded-e-lg rounded-s-none bg-transparent', className)}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = 'InputComponent';
