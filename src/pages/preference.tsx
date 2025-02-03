import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Question {
  id: string;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 'q1',
    text: 'How often do you wish you had someone to write to or chat with?',
    options: [
      'Multiple times a week',
      'Once a week',
      'Once a month',
      'Once every three months',
    ],
  },
  {
    id: 'q2',
    text: 'How often do you engage in social activities?',
    options: ['Daily', 'A few times a week', 'Once a week', 'Rarely'],
  },
  {
    id: 'q3',
    text: 'What is your preferred way of communicating?',
    options: ['Text/Chat', 'Voice calls', 'Video calls', 'In-person meetings'],
  },
  {
    id: 'q4',
    text: 'How often would you like to meet new people?',
    options: ['Several times a week', 'Weekly', 'Monthly', 'Occasionally'],
  },
  {
    id: 'q5',
    text: 'What type of social gatherings do you prefer?',
    options: [
      'One-on-one meetings',
      'Small groups (3-5 people)',
      'Medium groups (6-10 people)',
      'Large social events',
    ],
  },
];

export default function PreferencePage() {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleNext = () => {
    if (answers[questions[step].id]) {
      setStep((prev) => Math.min(prev + 1, questions.length - 1));
    }

    if (step === questions.length - 1) {
      alert('ompleted!');
    }
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [questions[step].id]: option }));
  };

  return (
    <div className="flex flex-grow items-center justify-center">
      <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-center text-xl font-bold">Lisa's Friend</h2>
        <Progress
          value={((step + 1) / questions.length) * 100}
          className="mt-4"
        />
        <div className="mt-6">
          <p className="text-lg font-medium">{questions[step].text}</p>
          <div className="mt-4 space-y-2">
            {questions[step].options.map((option, index) => (
              <label
                key={index}
                className="flex cursor-pointer items-center space-x-2"
              >
                <input
                  type="radio"
                  name={`survey-${step}`}
                  value={option}
                  checked={answers[questions[step].id] === option}
                  onChange={() => handleAnswer(option)}
                  className="accent-primary"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button onClick={handlePrevious} disabled={step === 0}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!answers[questions[step].id]}>
            {step === questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
