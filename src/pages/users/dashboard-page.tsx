import { useId } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { useGetUserProfile } from './_hooks/use-get-user-profile';
import { UserAvatar } from './_user-avatar/user-avatar';
import { ProfilePictureManager } from './profile-pictures-manager';
import { UpdateAddress } from './update-address';
import { UpdateHobbies } from './update-hobbies';
import { UpdatePassword } from './update-password';
import { UpdatePersonalInfo } from './update-personal-info';
import { UpdateProfileInformation } from './update-profile-information';

const DEFAULT_AVATAR = '/assets/avatar.jpg';

export function DashboardPage() {
  const { isLoading, user } = useGetUserProfile();

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <div>User not found</div>;

  let profileCompletionPercentage = 40;

  if (user.hobbies.length > 0) profileCompletionPercentage += 20;

  if (user.profilePics.length > 0) profileCompletionPercentage += 20;

  if (user.address.address) profileCompletionPercentage += 20;

  return (
    <div className="flex-grow w-full">
      <div className="w-full max-w-7xl mx-auto py-6 px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center">
            <UserAvatar
              name={`${user.personalData.firstName} ${user.personalData.lastName}`}
              profileImage={user.profilePics[0]?.url || DEFAULT_AVATAR}
              isVerified={true}
              profileCompletionPercentage={profileCompletionPercentage}
            />
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {/* <AccordionWithContent title="Profile Pictures"> */}
              <ProfilePictureManager initialImages={user.profilePics} />
            {/* </AccordionWithContent> */}

            {/* <AccordionWithContent title="User Details"> */}
              <UpdatePersonalInfo personalInfo={user.personalData} />
            {/* </AccordionWithContent> */}

            {/* <AccordionWithContent title="Mailing Address"> */}
              <UpdateAddress address={user.address} />
            {/* </AccordionWithContent> */}

            {/* <AccordionWithContent title="Update Profile Information"> */}
              <UpdateProfileInformation userProfile={user.profileData} />
            {/* </AccordionWithContent> */}

            {/* <AccordionWithContent title="Update Hobbies"> */}
              <UpdateHobbies hobbies={user.hobbies} />
            {/* </AccordionWithContent> */}
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
          <h2 className="text-lg font-semibold text-accent-foreground ">
            {title}
          </h2>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="py-2">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}
