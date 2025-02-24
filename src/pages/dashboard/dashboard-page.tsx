import { LoadingState } from '@/components/loading-state';

import { useGetUserProfile } from './_hooks/use-get-user-profile';
import { ProfilePictureManager } from './profile-pictures-manager';
import { UpdatePassword } from './update-password';
import { UpdatePersonalInfo } from './update-personal-info';

export function DashboardPage() {
  const { isLoading, user } = useGetUserProfile();

  if (isLoading) return <LoadingState />;

  if (!user) return <div>User not found</div>;

  return (
    <div className="w-full flex-grow">
      <div className="mx-auto w-full max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <ProfilePictureManager initialImages={user.profilePics} />

          <UpdatePersonalInfo personalInfo={user.personalData} />

          <UpdatePassword />
        </div>
      </div>
    </div>
  );
}
