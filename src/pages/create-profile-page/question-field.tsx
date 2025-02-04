import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

import type {
  TFormRadioField,
  TFormTextField,
  TFormTextareaField,
} from './form-fields';

type FieldProps = TFormTextField | TFormTextareaField | TFormRadioField;

interface QuestionFieldProps {
  field: FieldProps;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

export function QuestionField({
  field,
  value,
  onChange,
  error,
}: QuestionFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{field.description}</Label>
      {field.type === 'text' && (
        <Input
          type="text"
          name={field.name}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
        />
      )}
      {field.type === 'textarea' && (
        <Textarea
          name={field.name}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
        />
      )}
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
