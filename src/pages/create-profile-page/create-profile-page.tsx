import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/auth-store';

import { FileUploadField } from './file-upload-field';
import { formFields } from './form-fields';
import { QuestionField } from './question-field';
import { useCreateProfile } from './use-create-profile';

export function CreateProfilePage() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createProfile } = useCreateProfile();

  useEffect(() => {
    if (token?.decoded.profileId) {
      navigate('/');
    }
  }, [navigate, token?.decoded.profileId]);

  const handleNext = () => {
    const currentField = formFields[step];
    if (currentField.required && !answers[currentField.name]) {
      setErrors((prev) => ({
        ...prev,
        [currentField.name]: 'This field is required',
      }));
      return;
    }
    setErrors({});
    setStep((prev) => Math.min(prev + 1, formFields.length - 1));
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleAnswer = (name: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = () => {
    createProfile(answers);
  };

  return (
    <div
      className="flex flex-grow items-center justify-center"
      data-variant="secondary"
    >
      <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-center text-4xl font-bold">Lisa's Friend</h1>
        <div className="mt-4 flex justify-between items-center gap-3">
          <p className="text-muted-foreground">
            {(((step + 1) / formFields.length) * 100).toFixed(0)}%
          </p>
          <Progress value={((step + 1) / formFields.length) * 100} />
        </div>
        <div className="mt-6">
          {formFields[step].type === 'file' ? (
            <FileUploadField
              field={formFields[step]}
              onChange={handleAnswer}
              error={errors[formFields[step].name]}
            />
          ) : (
            <QuestionField
              field={formFields[step]}
              value={answers[formFields[step].name] || ''}
              onChange={handleAnswer}
              error={errors[formFields[step].name]}
            />
          )}
        </div>
        <div className="mt-6 flex justify-between">
          <Button onClick={handlePrevious} disabled={step === 0}>
            Previous
          </Button>
          {step === formFields.length - 1 ? (
            <Button onClick={handleSubmit}>Submit</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </div>
    </div>
  );
}
