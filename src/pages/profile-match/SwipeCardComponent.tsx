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

const SwipeArea = () => {
  interface User {
    name: string;
    url: string;
    email: string;
    phone: string;
    age: number;
    city: string;
  }

  type Direction = 'left' | 'right' | 'up' | 'down';

  const handleSwipe = (_: Direction, __: User): void => {
    // if (dir === "right") swipeRight(user);
    // else if (dir === "left") swipeLeft(user);
  };

  return (
    <div className="relative w-full max-w-sm h-[28rem] mx-auto">
      {db.map((user) => (
        <TinderCard
          className="absolute shadow-none"
          key={user.age}
          onSwipe={(dir) => handleSwipe(dir, user)}
          swipeRequirementType="position"
          swipeThreshold={100}
          preventSwipe={['up', 'down']}
        >
          <div
            className="card bg-white w-96 h-[25rem] select-none rounded-lg overflow-hidden border
					 border-gray-200"
          >
            <figure className="px-4 pt-4 w-3/5 h-3/4 mx-auto">
              <img
                src={user.url || '/avatar.png'}
                alt={user.name}
                className="rounded-lg object-cover h-full pointer-events-none"
              />
            </figure>
            <div className="card-body mt-4 px-4">
              <h2 className="card-title text-xl text-gray-800">{user.name}</h2>
              <p className="text-gray-600">
                {user.city} | {user.age} | {user.phone}
              </p>
            </div>
          </div>
        </TinderCard>
      ))}
    </div>
  );
};
export default SwipeArea;
