import { PersonalInfoForm } from './personal-information';
import { ProfileImage } from './profile-image';
import { ProfileInformation } from './profile-information';

const personalInfo = {
  firstName: 'Siddiq',
  lastName: 'Ahmed',
  email: 'siddiq@example.com',
  phoneNumber: '+9230498349985',
};

export function ShowProfilePage() {
  return (
    <div className="flex-grow w-full">
      <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <ProfileImage name="Siddiq Ahmed" />
          <PersonalInfoForm personalInfo={personalInfo} />
          <ProfileInformation
            userProfile={{
              meetingPreference: 'chat',
              feelsLonely: 'no',
              chatFrequency: 'once-a-week',
              city: 'karachi',
              age: '18-24',
              selfDescription: '',
              discussionTopics: '',
              friendExpectations: '',
              idVerification: '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
