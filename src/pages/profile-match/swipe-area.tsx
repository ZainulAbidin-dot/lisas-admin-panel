import TinderCard from 'react-tinder-card';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

import heart from '../../assets/images/green-heart.png';
import like from '../../assets/images/like.png';
import nope from '../../assets/images/nope.png';
import redX from '../../assets/images/red-x.png';
import PopUp from './pop-up';
import { TProfileSuggestion, useProfileMatch } from './profile-match-context';
import { useRef } from 'react';

type Direction = 'left' | 'right' | 'up' | 'down';

export function SwipeArea() {
  const { handleRightSwipe, handleLeftSwipe, profileSuggestions } =
    useProfileMatch();
  const [swipesCount, setSwipesCount] = useLocalStorage('swipesCount', 0);
  const { token } = useAuthStore();

  const userHasSubscription = token?.decoded.hasActiveSubscription;

  const noMoreSwipes = !userHasSubscription && swipesCount > 4;

  const cardRefs = useRef<(any | null)[]>([]); // Store multiple refs

  const handleSwipe = (dir: Direction, index: number, user: TProfileSuggestion): void => {
    const nopeElement = document.getElementById(`nope-${user.id}`);
    const likeElement = document.getElementById(`like-${user.id}`);

    setSwipesCount(swipesCount + 1);

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

    if (cardRefs.current[index]) {
      cardRefs.current[index]?.swipe(dir);
    }
  };


  return (
    <div className="relative w-full max-w-sm h-[28rem] mx-auto">
      {profileSuggestions.map((user, index) => (
        <TinderCard
          className={cn(
            'absolute shadow-none bg-white',
            noMoreSwipes && 'pointer-events-none'
          )}
          ref={(el) => (cardRefs.current[index] = el)}
          key={user.id}
          onSwipe={(dir) => handleSwipe(dir, index, user)}
          swipeRequirementType="position"
          swipeThreshold={100}
          preventSwipe={['up', 'down']}
        >
          <div className="card w-[20rem] h-[28rem] select-none rounded-lg overflow-hidden border border-gray-200 relative">
            <img
              src={user.profileImages?.[0] ?? '/assets/avatar.jpg'}
              alt={user.name}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            <div
              className="absolute top-4 left-4 hidden"
              id={`nope-${user.id}`}
              onClick={() => handleSwipe('left', index, user)}
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
                <h2 className="text-2xl text-primary">
                  {user.name},
                  <span className="text-sm font-light">{user.age}</span>
                </h2>
                <p className="text-gray-300 font-light">{user.city}</p>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-end w-full">
                <button className="py-2 rounded-full shadow-md hover:pointer" onClick={() => handleSwipe('left', index, user)} >
                  <img src={redX} alt="Dislike" className="w-12 h-11" />
                </button>
                <button className="p-2 rounded-full shadow-md hover:pointer" onClick={() => handleSwipe('right', index, user)} >
                  <img src={heart} alt="Like" className="w-12 h-12" />
                </button>
              </div>
            </div>
          </div>
        </TinderCard>
      ))}
      {noMoreSwipes ? <PopUp /> : null}
    </div>
  );
}
