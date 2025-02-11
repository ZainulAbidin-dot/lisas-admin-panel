import TinderCard from 'react-tinder-card';

import heart from '../../assets/images/green-heart.png';
import like from '../../assets/images/like.png';
import nope from '../../assets/images/nope.png';
import redX from '../../assets/images/red-x.png';
import {
  type TProfileSuggestion,
  useGetProfileMatchSuggestions,
  useProfileCardSwap,
} from './use-profile-match';

type Direction = 'left' | 'right' | 'up' | 'down';

const SwipeArea = () => {
  const { isLoading, profileSuggestions } = useGetProfileMatchSuggestions();
  const { handleLeftSwipe, handleRightSwipe } = useProfileCardSwap();

  const handleSwipe = (dir: Direction, user: TProfileSuggestion): void => {
    const nopeElement = document.getElementById(`nope-${user.id}`);
    const likeElement = document.getElementById(`like-${user.id}`);

    if (dir === 'left' && nopeElement) {
      nopeElement.style.display = 'block';
      setTimeout(() => {
        nopeElement.style.display = 'none';
      }, 1000);
    } else if (dir === 'right' && likeElement) {
      likeElement.style.display = 'block';
      setTimeout(() => {
        likeElement.style.display = 'none';
      }, 1000);
    }

    if (dir === 'left') {
      handleLeftSwipe(user.id);
    } else if (dir === 'right') {
      handleRightSwipe(user.id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="relative w-full max-w-sm h-[28rem] mx-auto">
      {profileSuggestions.map((user) => (
        <TinderCard
          className="absolute shadow-none bg-white"
          key={user.id}
          onSwipe={(dir) => handleSwipe(dir, user)}
          swipeRequirementType="position"
          swipeThreshold={100}
          preventSwipe={['up', 'down']}
        >
          <div className="card w-[20rem] h-[28rem] select-none rounded-lg overflow-hidden border border-gray-200 relative">
            <img
              src={user.profileImageUrl ?? '/avatar.jpg'}
              alt={user.name}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              onError={(event) => {
                const currentTarget = event.currentTarget as HTMLImageElement;
                currentTarget.onerror = null;
                currentTarget.src = '/avatar.jpg';
              }}
            />

            <div
              className="absolute top-4 left-4 hidden"
              id={`nope-${user.id}`}
            >
              <img src={nope} alt="Nope" className="w-16 h-16" />
            </div>
            <div
              className="absolute top-4 right-4 hidden"
              id={`like-${user.id}`}
            >
              <img src={like} alt="Like" className="w-16 h-16" />
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
              <div className="relative bottom-12">
                <h2 className="text-2xl text-white">
                  {user.name}{' '}
                  <span className="text-sm font-light">{user.age}</span>
                </h2>
                <p className="text-gray-300 font-light">{user.city}</p>
                <p className="text-gray-300 font-light">{user.email}</p>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-end w-full">
                <button className="py-2 rounded-full shadow-md">
                  <img src={redX} alt="Dislike" className="w-12 h-11" />
                </button>
                <button className="p-2 rounded-full shadow-md">
                  <img src={heart} alt="Like" className="w-12 h-12" />
                </button>
              </div>
            </div>
          </div>
        </TinderCard>
      ))}
    </div>
  );
};

export default SwipeArea;
