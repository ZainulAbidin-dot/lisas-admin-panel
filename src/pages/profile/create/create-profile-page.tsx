import {  useState } from 'react';

import { isPossiblePhoneNumber } from 'react-phone-number-input';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { DoubleTextField } from './double-text-field';
import { FileUploadField } from './file-upload-field';
import { formFields } from './form-fields';
import { PasswordField } from './password-field';
import { PhoneField } from './phone-field';
import { RadioField } from './radio-field';
import { TextField } from './text-field';
import { useCreateProfile } from './use-create-profile';

export function CreateProfilePage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createProfile,  } = useCreateProfile();

  const handleNext = () => {
    const currentField = formFields[step];

    switch (currentField.type) {
      case 'double-text': {
        let isValid = true;
        if (
          currentField.firstField.required &&
          !answers[currentField.firstField.name] 
        ) {
          setErrors((prev) => ({
            ...prev,
            [currentField.firstField.name]: 'This field is required',
          }));
          isValid = false;
        }
        if (
          currentField.secondField.required &&
          !answers[currentField.secondField.name]
        ) {
          setErrors((prev) => ({
            ...prev,
            [currentField.secondField.name]: 'This field is required',
          }));
          isValid = false;
        }

        if(!isValid) return;
        
        break;
      }
      case 'phone': {
        if (!answers[currentField.name]) {
          setErrors((prev) => ({
            ...prev,
            [currentField.name]: 'This field is required',
          }));
          return;
        }
        if (!isPossiblePhoneNumber(answers[currentField.name])) {
          setErrors((prev) => ({
            ...prev,
            [currentField.name]: 'Invalid phone number',
          }));
          return;
        }
        break;
      }
      case 'password': {
        if(!answers.password) {
          setErrors((prev) => ({
            ...prev,
            password: 'Password is required',
          }));
          return;
        }

        if (answers.password !== answers.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: 'Passwords do not match',
          }));
          return;
        }
        break;
      }
      default:
        if (currentField.required && !answers[currentField.name]) {
          setErrors((prev) => ({
            ...prev,
            [currentField.name]: 'This field is required',
          }));
          return;
        }
    }

    setErrors({});
    setStep((prev) => Math.min(prev + 1, formFields.length - 1));

    if (step === formFields.length - 1) {
      createProfile(answers);
    }
  };


  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleAnswer = (name: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="flex flex-grow items-center justify-center px-4">
      <div className="mx-auto w-full max-w-5xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-center text-4xl font-bold">Lisa's Friend</h1>
        <div className="mt-4 flex justify-between items-center gap-3">
          <p className="text-muted-foreground">
            {(((step + 1) / formFields.length) * 100).toFixed(0)}%
          </p>
          <Progress value={((step + 1) / formFields.length) * 100} />
        </div>
        <div className="mt-6">
           
              <RenderStep
                step={step}
                answers={answers}
                errors={errors}
                handleAnswer={handleAnswer}
              />
        </div>
        <div className="mt-6 flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={step === 0}
            className="hover:bg-[hsl(var(--primary-hover))]"
          >
            Previous
          </Button>
          
            <Button
            onClick={handleNext}
            className="hover:bg-[hsl(var(--primary-hover))]"
          >
            Next
          </Button>
          
        </div>
      </div>
    </div>
  );
}

function RenderStep({
  step,
  answers,
  errors,
  handleAnswer,
}: {
  step: number;
  answers: Record<string, string>;
  errors: Record<string, string>;
  handleAnswer: (name: string, value: string) => void;
}) {
  const currentFieldType = formFields[step].type;

  if (currentFieldType === 'file') {
    return (
      <FileUploadField
        field={formFields[step]}
        onChange={handleAnswer}
        error={errors[formFields[step].name]}
      />
    );
  }

  if (currentFieldType === 'text' || currentFieldType === 'textarea') {
    return (
      <TextField
        field={formFields[step]}
        value={answers[formFields[step].name] || ''}
        onChange={handleAnswer}
        error={errors[formFields[step].name]}
      />
    );
  }

  if (currentFieldType === 'radio') {
    return (
      <RadioField
        field={formFields[step]}
        value={answers[formFields[step].name] || ''}
        onChange={handleAnswer}
        error={errors[formFields[step].name]}
      />
    );
  }

  if (currentFieldType === 'double-text') {
    return (
      <DoubleTextField
        field={formFields[step]}
        firstField={{
          value: answers[formFields[step].firstField.name] || '',
          error: errors[formFields[step].firstField.name],
        }}
        secondField={{
          value: answers[formFields[step].secondField.name] || '',
          error: errors[formFields[step].secondField.name],
        }}
        onChange={handleAnswer}
      />
    );
  }

  if (currentFieldType === 'phone') {
    return (
      <PhoneField
        field={formFields[step]}
        value={answers[formFields[step].name] || ''}
        onChange={handleAnswer}
        error={errors[formFields[step].name]}
      />
    );
  }

  if (currentFieldType === 'password') {
    return (
      <PasswordField
        field={formFields[step]}
        onChange={handleAnswer}
        password={{
          name: 'password',
          value: answers.password || '',
          error: errors.password,
        }}
        confirmPassword={{
          name: 'confirmPassword',
          value: answers.confirmPassword || '',
          error: errors.confirmPassword,
        }}
      />
    );
  }
}
