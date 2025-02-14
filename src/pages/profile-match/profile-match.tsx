import { ProfileMatchSidebar } from './MatchBar';
import { ProfileMatchProvider, useProfileMatch } from './profile-match-context';
import { SwipeArea } from './swipe-area';

export function ProfileMatchPage() {
  return (
    <ProfileMatchProvider>
      <ProfileMatchPageComponent />
    </ProfileMatchProvider>
  );
}

function ProfileMatchPageComponent() {
  const { isLoading, profileSuggestions } = useProfileMatch();

  if (isLoading) return <ProfileMatchPageLoader />;

  const profileSuggesstionsLength = profileSuggestions.length;

  return (
    <div className="flex flex-grow justify-between bg-gray-200">
      <ProfileMatchSidebar />
      <div className="flex flex-col w-full items-center p-4">
        <div className="h-full w-full p-6 flex flex-col">
          <div className="flex h-full w-full items-center justify-center">
            <SwipeArea />
          </div>
          <p className="text-center text-primary font-semibold text-4xl mt-auto">
            Congratulations! You’ve Got {profileSuggesstionsLength} New Matches
            with Shared Interests!
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileMatchPageLoader() {
  return (
    <div className="flex flex-grow justify-center items-center">
      <img src="/assets/profile-match-loader.gif" alt="loader" />
    </div>
  );
}
