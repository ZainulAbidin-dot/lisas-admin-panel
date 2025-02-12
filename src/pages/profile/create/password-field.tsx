import { useState } from 'react';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { TFormPasswordField } from './form-fields';

type FieldProps = TFormPasswordField;

interface PasswordFieldProps {
  field: FieldProps;
  onChange: (name: string, value: string) => void;

  password: {
    name: string;
    value: string;
    error?: string;
  };

  confirmPassword: {
    name: string;
    value: string;
    error?: string;
  };
}

export function PasswordField({
  field,
  onChange,
  password,
  confirmPassword,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className="space-y-2">
      <Label>{field.description}</Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor={password.name}>Password</label>
          <div className="relative">
            <Input
              id={password.name}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password.value}
              onChange={(e) => onChange(password.name, e.target.value)}
              className="mt-1 bg-transparent pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
          {password.error && (
            <p className="text-red-500 text-sm">{password.error}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor={confirmPassword.name}>Confirm Password</label>
          <div className="relative">
            <Input
              id={confirmPassword.name}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={confirmPassword.value}
              onChange={(e) => onChange(confirmPassword.name, e.target.value)}
              className="mt-1 bg-transparent pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500"
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={18} />
              ) : (
                <EyeIcon size={18} />
              )}
            </button>
          </div>
          {confirmPassword.error && (
            <p className="text-red-500 text-sm">{confirmPassword.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
