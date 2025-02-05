import React from 'react';

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { cn } from '@/lib/utils';

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => (
  <input
    type="text"
    className={cn(
      'flex h-10 w-full rounded-md bg-transparent px-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      className
    )}
    ref={ref}
    placeholder="Enter phone number"
    {...props}
  />
));
InputComponent.displayName = 'InputComponent';

interface PhoneNumberInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

export function PhoneNumberInput({ value, onChange }: PhoneNumberInputProps) {
  return (
    <PhoneInput
      international
      value={value}
      onChange={onChange}
      inputComponent={InputComponent}
      className="w-full border border-input rounded-md px-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
    />
  );
}
