import TinderCard from 'react-tinder-card';
import heart from '../../assets/images/green-heart.png';
import redX from '../../assets/images/red-x.png';
import like from '../../assets/images/like.png';
import nope from '../../assets/images/nope.png';

const db = [
  {
    name: 'Richard Hendricks',
    url: 'https://3djakob.github.io/react-tinder-card-demo/img/dinesh.jpg',
    email: 'richard@example.com',
    phone: '123-456-7890',
    age: 32,
    city: 'Palo Alto, San Francisco',
  },
  {
    name: 'Erlich Bachman',
    url: 'https://3djakob.github.io/react-tinder-card-demo/img/jared.jpg',
    email: 'erlich@example.com',
    phone: '234-567-8901',
    age: 35,
    city: 'San Francisco, San Francisco',
  },
  {
    name: 'Monica Hall',
    url: 'https://3djakob.github.io/react-tinder-card-demo/img/monica.jpg',
    email: 'monica@example.com',
    phone: '345-678-9012',
    age: 29,
    city: 'San Francisco, San Francisco',
  },
  {
    name: 'Jared Dunn',
    url: 'https://3djakob.github.io/react-tinder-card-demo/img/erlich.jpg',
    email: 'jared@example.com',
    phone: '456-789-0123',
    age: 34,
    city: 'Palo Alto, San Francisco',
  },
  {
    name: 'Dinesh Chugtai',
    url: 'https://3djakob.github.io/react-tinder-card-demo/img/richard.jpg',
    email: 'dinesh@example.com',
    phone: '567-890-1234',
    age: 31,
    city: 'Palo Alto, San Francisco',
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

  const handleSwipe = (dir: Direction, user: User): void => {
    const nopeElement = document.getElementById(`nope-${user.age}`);
    const likeElement = document.getElementById(`like-${user.age}`);

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
          <div className="card w-[20rem] h-[28rem] select-none rounded-lg overflow-hidden border border-gray-200 relative">
            <img
              src={user.url || '/avatar.png'}
              alt={user.name}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            
            <div className="absolute top-4 left-4 hidden" id={`nope-${user.age}`}>
              <img src={nope} alt="Nope" className="w-16 h-16" />
            </div>
            <div className="absolute top-4 right-4 hidden" id={`like-${user.age}`}>
              <img src={like} alt="Like" className="w-16 h-16" />
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
              <div className="relative bottom-12">
                <h2 className="text-2xl text-white">
                  {user.name} <span className="text-sm font-light">{user.age}</span>
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
