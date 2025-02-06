import { useGetUserProfile } from './_hooks/use-get-user-profile';
import { PersonalInfoForm } from './personal-information';
import { ProfileImage } from './profile-image';
import { ProfileInformation } from './profile-information';

export function ShowProfilePage() {
  const { isLoading, user: userProfile } = useGetUserProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>User not found</div>;
  }

  console.log(userProfile);

  return (
    <div className="flex-grow w-full">
      <div className="w-full max-w-7xl mx-auto py-6 px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <ProfileImage
            name={`${userProfile.personalData.firstName} ${userProfile.personalData.lastName}`}
            profileImage={userProfile.profileData?.profileImage}
          />
          <PersonalInfoForm personalInfo={userProfile.personalData} />
          {userProfile.profileData ? (
            <ProfileInformation userProfile={userProfile.profileData} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
