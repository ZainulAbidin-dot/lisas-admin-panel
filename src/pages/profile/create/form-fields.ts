export const formFields: TFormField[] = [
  {
    name: 'meetingPreference',
    description: "I'm more interested in meeting a friend to:",
    type: 'radio',
    required: true,
    options: [
      { label: 'Talk with on the phone or Zoom', value: 'phone' },
      { label: 'Write to as a Pen Pal', value: 'penpal' },
      { label: 'Chat with the person on the computer', value: 'chat' },
    ],
  },
  {
    name: 'feelsLonely',
    description: 'Do you feel lonely at times?',
    type: 'radio',
    required: true,
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    name: 'chatFrequency',
    description:
      'How often do you wish you had someone to write to or chat with?',
    type: 'radio',
    required: true,
    options: [
      { label: 'Multiple times a week', value: 'multiple-times-a-week' },
      { label: 'Once a week', value: 'once-a-week' },
      { label: 'Once a month', value: 'once-a-month' },
      { label: 'Once every three months', value: 'once-every-three-months' },
    ],
  },
  {
    name: 'city',
    description: 'What City are you located in?',
    type: 'text',
    required: true,
    placeholder: 'e.g. San Francisco',
  },
  {
    name: 'age',
    description: 'How old are you?',
    type: 'radio',
    required: true,
    options: [
      { label: 'Under 18', value: 'under-18' },
      { label: '18-24', value: '18-24' },
      { label: '25-34', value: '25-34' },
      { label: '35-44', value: '35-44' },
      { label: '45-54', value: '45-54' },
      { label: '55-64', value: '55-64' },
      { label: '65 or older', value: '65-or-older' },
    ],
  },
  {
    name: 'selfDescription',
    description: 'What adjectives would describe yourself?',
    type: 'text',
    required: true,
    placeholder: 'Enter adjectives like creative, adventurous, or empathetic.',
  },
  {
    name: 'discussionTopics',
    description: 'What do you like to talk about with friends?',
    type: 'textarea',
    required: true,
    placeholder:
      'Write about things you enjoy discussing, like adventures, career, or relationships.',
  },
  {
    name: 'friendExpectations',
    description: 'What are you looking for in new friends?',
    type: 'textarea',
    required: true,
    placeholder: 'e.g., shared interests, loyalty, or a sense of humor.',
  },
  {
    name: 'idVerification',
    description:
      "For faster account verification, please upload a form of identification (Driver's License, Passport, etc) optional",
    type: 'file',
    required: false,
    placeholder:
      'Select a file to upload your ID (e.g., photo of passport or license)',
  },
];

export type TFormTextField = {
  name: string;
  description: string;
  type: 'text';
  required: boolean;
  placeholder: string;
};

export type TFormTextareaField = {
  name: string;
  description: string;
  type: 'textarea';
  required: boolean;
  placeholder: string;
};

export type TFormRadioField = {
  name: string;
  description: string;
  type: 'radio';
  required: boolean;
  options: { label: string; value: string }[];
};

export type TFormFileField = {
  name: string;
  description: string;
  type: 'file';
  required: boolean;
  placeholder: string;
};

export type TFormField =
  | TFormTextField
  | TFormTextareaField
  | TFormRadioField
  | TFormFileField;
