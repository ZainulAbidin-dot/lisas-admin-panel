import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadFieldProps {
  field: {
    name: string;
    description: string;
    required: boolean;
  };
  onChange: (name: string, value: string) => void;
  error?: string;
}

export function FileUploadField({
  field,
  onChange,
  error,
}: FileUploadFieldProps) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onChange(field.name, '');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(field.name, reader.result);
          setFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{field.description}</Label>
      <Input type="file" onChange={handleFileChange} />
      {fileName && (
        <p className="text-sm text-gray-600">Selected: {fileName}</p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
