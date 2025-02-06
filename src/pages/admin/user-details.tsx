import { useParams } from 'react-router-dom';

const initialUsers = [
  {
    id: 1,
    profile_img: 'https://via.placeholder.com/150',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone_number: '123-456-7890',
    role: 'Admin',
  },
  {
    id: 2,
    profile_img: 'https://via.placeholder.com/150',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    phone_number: '098-765-4321',
    role: 'User',
  },
];

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const user = initialUsers.find((user) => user.id === parseInt(userId || ''));

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        User Details
      </h1>
      <div className="flex items-center mb-6">
        <img
          src={user.profile_img}
          alt={`${user.first_name} ${user.last_name}`}
          className="w-24 h-24 rounded-full border-4 border-indigo-600 mr-6"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-gray-500">{user.phone_number}</p>
          <p className="text-gray-500">{user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
