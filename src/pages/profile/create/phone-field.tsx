import { PhoneNumberInput } from '@/components/composed/phone-input';
import { Label } from '@/components/ui/label';

import type { TFormPhoneField } from './form-fields';

type FieldProps = TFormPhoneField;

interface PhoneFieldProps {
  field: FieldProps;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

export function PhoneField({ field, value, onChange, error }: PhoneFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{field.description}</Label>
      <PhoneNumberInput
        value={value}
        onChange={(val) => {
          if (val) {
            onChange(field.name, val);
          }
        }}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
