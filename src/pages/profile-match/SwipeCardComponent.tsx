import React, { useMemo, useRef, useState } from 'react';

import TinderCard from 'react-tinder-card';

const db = [
  {
    name: 'Richard Hendricks',
    url: 'https://3djakob.github.io/react-tinder-card-demo/img/dinesh.jpg',
    email: 'richard@example.com',
    phone: '123-456-7890',
    age: 32,
    city: 'Palo Alto',
  },
  {
    name: 'Erlich Bachman',
    url: 'https://3djakob.github.io/react-tinder-card-demo/img/jared.jpg',
    email: 'erlich@example.com',
    phone: '234-567-8901',
    age: 35,
    city: 'San Francisco',
  },
  {
    name: 'Monica Hall',
    url: 'https://3djakob.github.io/react-tinder-card-demo/img/monica.jpg',
    email: 'monica@example.com',
    phone: '345-678-9012',
    age: 29,
    city: 'San Francisco',
  },
  {
    name: 'Jared Dunn',
    url: 'https://3djakob.github.io/react-tinder-card-demo/img/erlich.jpg',
    email: 'jared@example.com',
    phone: '456-789-0123',
    age: 34,
    city: 'Palo Alto',
  },
  {
    name: 'Dinesh Chugtai',
    url: 'https://3djakob.github.io/react-tinder-card-demo/img/richard.jpg',
    email: 'dinesh@example.com',
    phone: '567-890-1234',
    age: 31,
    city: 'Palo Alto',
  },
];

const Advanced: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(db.length - 1);
  const [lastDirection, setLastDirection] = useState<string | undefined>();
  const currentIndexRef = useRef<number>(currentIndex);
  const [swipeCount, setSwipeCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map(() =>
          React.createRef<{
            swipe: (dir: 'left' | 'right') => Promise<void>;
            restoreCard: () => Promise<void>;
          }>()
        ),
    []
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;
  const canSwipe = swipeCount < 3;

  const swiped = (direction: string, _: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
    setSwipeCount(swipeCount + 1);
  };

  const outOfFrame = (name: string, idx: number) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    console.log(canSwipe, swipeCount);
    if (canSwipe && currentIndexRef.current >= idx) {
      childRefs[idx].current?.restoreCard();
    } else {
      alert('Cannot swipe anymore. Pay to continue.');
    }
  };

  const swipe = async (dir: 'left' | 'right') => {
    if (canSwipe && currentIndex >= 0) {
      setLoading(true);
      await childRefs[currentIndex].current?.swipe(dir);
      setLoading(false);
    } else {
      console.log('Cannot swipe anymore. Pay to continue.');
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    setLoading(true);
    await childRefs[newIndex].current?.restoreCard();
    setLoading(false);
    setSwipeCount(swipeCount - 1);
  };

  return (
    <div className="flex flex-col items-center">
      <link
        href="https://fonts.googleapis.com/css?family=Damion&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      <h1 className="text-4xl font-bold mb-8">React Tinder Card</h1>
      <div className="relative w-full max-w-md h-96">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="loader"></div>
          </div>
        )}
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="absolute w-full h-full"
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div className="flex flex-col items-start p-4 mx-auto w-[80%] h-full bg-white border-2 border-[#999]  rounded-2xl ">
              <div
                style={{ backgroundImage: 'url(' + character.url + ')' }}
                className="bg-cover bg-left w-32 h-32 rounded-full shadow-lg"
              ></div>
              <div className="mt-8 text-left text-[#1a3d35] text-[24px]">
                <h3 className="text-xl">Name: {character.name}</h3>
                <p className="text-xl">Email: {character.email}</p>
                <p className="text-xl">PhoneNo.: {character.phone}</p>
                <p className="text-xl">Age: {character.age} years old</p>
                <p className="text-xl">City: {character.city}</p>
              </div>
              <button
                type="button"
                className="w-full bg-[#68778f] mt-4 text-white py-2 px-6 text-center rounded"
              >
                Loves phone calls with new friends
              </button>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="flex space-x-4 mt-8">
        <button
          className={`px-4 py-2 rounded ${!canSwipe ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          onClick={() => swipe('left')}
        >
          Swipe left!
        </button>
        <button
          className={`px-4 py-2 rounded ${!canGoBack ? 'bg-gray-300' : 'bg-green-500 text-white'}`}
          onClick={() => goBack()}
        >
          Undo swipe!
        </button>
        <button
          className={`px-4 py-2 rounded ${!canSwipe ? 'bg-gray-300' : 'bg-red-500 text-white'}`}
          onClick={() => swipe('right')}
        >
          Swipe right!
        </button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className="mt-4 text-lg">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="mt-4 text-lg">
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
  );
};

export default Advanced;
