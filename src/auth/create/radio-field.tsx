import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import type {
  TFormRadioField,
} from './form-fields';

type FieldProps =  TFormRadioField;

interface RadioFieldProps {
  field: FieldProps;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

export function RadioField({
  field,
  value,
  onChange,
  error,
}: RadioFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{field.description}</Label>
      {field.type === 'radio' && field.options && (
        <RadioGroup
          value={value}
          onValueChange={(val) => onChange(field.name, val)}
          className="space-y-2"
        >
          {field.options.map((option) => (
            <Label
              key={option.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <RadioGroupItem value={option.value} />
              <span>{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
