import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { TFormDoubleTextField } from './form-fields';

type FieldProps = TFormDoubleTextField;

interface DoubleTextFieldProps {
  field: FieldProps;
  onChange: (name: string, value: string) => void;

  firstField: {
    value: string;
    error?: string;
  };

  secondField: {
    value: string;
    error?: string;
  };
}

export function DoubleTextField({
  field,
  firstField,
  secondField,
  onChange,
}: DoubleTextFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{field.description}</Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={field.firstField.name}>
            {field.firstField.label}
          </Label>
          <Input
            type="text"
            name={field.firstField.name}
            value={firstField.value}
            onChange={(e) => onChange(field.firstField.name, e.target.value)}
            placeholder={field.firstField.placeholder}
          />
          {firstField.error && (
            <p className="text-red-500 text-sm">{firstField.error}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={field.secondField.name}>
            {field.secondField.label}
          </Label>
          <Input
            type="text"
            name={field.secondField.name}
            value={secondField.value}
            onChange={(e) => onChange(field.secondField.name, e.target.value)}
            placeholder={field.secondField.placeholder}
          />
          {secondField.error && (
            <p className="text-red-500 text-sm">{secondField.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
