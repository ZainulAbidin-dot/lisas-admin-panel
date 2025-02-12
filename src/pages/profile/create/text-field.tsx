import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type {
  TFormTextField,
  TFormTextareaField,
} from './form-fields';

type FieldProps = TFormTextField | TFormTextareaField;

interface TextFieldProps {
  field: FieldProps;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

export function TextField({
  field,
  value,
  onChange,
  error,
}: TextFieldProps) {
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
