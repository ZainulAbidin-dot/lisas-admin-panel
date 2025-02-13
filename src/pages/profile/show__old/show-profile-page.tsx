import { useGetUserProfile } from './_hooks/use-get-user-profile';
import { UpdatePassword } from './update-password';
import { UpdatePersonalInfo } from './update-personal-information';
import { UpdateProfileImage } from './update-profile-image';
import { UpdateProfileInformation } from './update-profile-information';

export function ShowProfilePage() {
  const { isLoading, user: userProfile } = useGetUserProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>User not found</div>;
  }

  console.log({ isLoading, userProfile });

  return (
    <div className="flex-grow w-full">
      <div className="w-full max-w-7xl mx-auto py-6 px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <UpdateProfileImage
            name={`${userProfile.personalData.firstName} ${userProfile.personalData.lastName}`}
            profileImage={userProfile.profileData?.profileImage}
          />
          <UpdatePersonalInfo personalInfo={userProfile.personalData} />
          <UpdatePassword />
          {userProfile.profileData ? (
            <UpdateProfileInformation userProfile={userProfile.profileData} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
