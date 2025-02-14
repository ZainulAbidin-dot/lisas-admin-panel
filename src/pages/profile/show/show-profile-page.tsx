import { useId } from 'react';

import { InfoIcon } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { UserAvatar } from './_user-avatar/user-avatar';
import { ProfilePictureManager } from './profile-pictures-manager';
import { UpdateCompleteAddress } from './update-complete-address';
import { UpdateHobbies } from './update-hobbies';
import { UpdatePassword } from './update-password';
import { UpdatePersonalInfo } from './update-personal-info';
import { UpdateProfileInformation } from './update-profile-information';

const personalInfo = {
  firstName: 'Siddiq',
  lastName: 'Ahmed',
  email: 'siddiq@gmail.com',
  phoneNumber: '+923123123123',
};

const completeAddress = {
  streetAddress: '123 Main Street',
  city: 'New York',
  country: 'USA',
  zipCode: '10001',
};

export function ShowProfilePage() {
  return (
    <div className="flex-grow w-full">
      <div className="w-full max-w-7xl mx-auto py-6 px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center">
            <UserAvatar
              name="Siddiq Ahmed"
              profileImage="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              isVerified={true}
              profileCompletionPercentage={80}
            />
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            <AccordionWithContent title="Profile Pictures">
              <ProfilePictureManager
                initialImages={[
                  {
                    id: '1',
                    url: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
                  },
                  {
                    id: '2',
                    url: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?cs=srgb&dl=pexels-sulimansallehi-1704488.jpg&fm=jpg',
                  },
                ]}
              />
            </AccordionWithContent>

            <AccordionWithContent title="User Details">
              <UpdatePersonalInfo personalInfo={personalInfo} />
            </AccordionWithContent>

            <AccordionWithContent title="Change Password">
              <UpdatePassword />
            </AccordionWithContent>

            <AccordionWithContent title="Complete Address">
              <UpdateCompleteAddress completeAddress={completeAddress} />
            </AccordionWithContent>

            <AccordionWithContent title="Update Profile Information">
              <UpdateProfileInformation
                userProfile={{
                  meetingPreference: 'phone',
                  feelsLonely: 'yes',
                  chatFrequency: 'multiple-times-a-week',
                  age: 'under-18',
                  selfDescription: 'I am a self-described person',
                  discussionTopics: 'Topic 1, Topic 2, Topic 3',
                  friendExpectations:
                    'Expectation 1, Expectation 2, Expectation 3',
                  idVerification: '',
                }}
              />
            </AccordionWithContent>

            <AccordionWithContent title="Update Hobbies">
              <UpdateHobbies />
            </AccordionWithContent>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function AccordionWithContent({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <AccordionItem value={id} className="border-b-0">
      <AccordionTrigger className="w-full py-4 px-6 lg:px-8 bg-accent rounded-full hover:no-underline">
        <div className="flex items-center gap-2">
          <InfoIcon className="size-6" />
          <h2 className="text-xl font-semibold text-accent-foreground ">
            {title}
          </h2>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-2 py-2">{children}</AccordionContent>
    </AccordionItem>
  );
}
