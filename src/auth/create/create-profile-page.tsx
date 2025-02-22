import { useState } from 'react';

import { isPossiblePhoneNumber } from 'react-phone-number-input';

import { ButtonWithLoader } from '@/components/composed/button-with-loader';
import { Footer } from '@/components/shared/footer';
import { Logo } from '@/components/shared/navbar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

import { DoubleTextField } from './double-text-field';
import { FileUploadField } from './file-upload-field';
import { formFields } from './form-fields';
import { PasswordField } from './password-field';
import { PhoneField } from './phone-field';
import { RadioField } from './radio-field';
import { TextField } from './text-field';
import { useCreateProfile } from './use-create-profile';

export function CreateProfilePage() {
  return (
    <div className="flex h-dvh flex-col">
      <CreateProfilePageNav />

      <CreateProfileForm />

      <Footer />
    </div>
  );
}

function CreateProfileForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    createProfile,
    checkIsEmailTaken,
    isCheckingEmail,
    isCreatingProfile,
  } = useCreateProfile();

  const handleNext = async () => {
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

        if (!isValid) return;

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
        if (!answers.password) {
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

    if (currentField.name === 'email') {
      console.log('Email field is here', answers.email);
      const { emailTaken, message } = await checkIsEmailTaken(answers.email);

      if (emailTaken) {
        setErrors((prev) => ({
          ...prev,
          email: message || 'Email already taken',
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
    <main className="flex flex-grow items-center justify-center px-4">
      <div className="mx-auto w-full max-w-5xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-center text-4xl font-bold">Lisa's Friend</h1>
        <div className="mt-4 flex items-center justify-between gap-3">
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
          <Button onClick={handlePrevious} disabled={step === 0} className="">
            Previous
          </Button>

          <ButtonWithLoader
            onClick={handleNext}
            className=""
            isLoading={isCheckingEmail || isCreatingProfile}
            disabled={Object.values(errors).filter(Boolean).length > 0}
            loadingText={
              isCheckingEmail
                ? 'Checking email'
                : isCreatingProfile
                  ? 'Creating profile'
                  : 'Unknown loading state'
            }
            initialText={
              step === formFields.length - 1 ? 'Create Profile' : 'Next'
            }
          />
        </div>
      </div>
    </main>
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

function CreateProfilePageNav() {
  return (
    <nav
      className={cn(
        'bg-primary text-primary-foreground',
        'flex h-16 items-center px-2 sm:px-4'
      )}
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
          </div>
        </div>
      </div>
    </nav>
  );
}
