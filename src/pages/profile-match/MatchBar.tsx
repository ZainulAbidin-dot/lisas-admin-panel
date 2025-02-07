import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const users = [
  {
    id: 1,
    name: 'John Doe',
    profession: 'Software Engineer',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    status: 'Online',
  },
  {
    id: 2,
    name: 'Jane Smith',
    profession: 'Product Manager',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    status: 'Offline',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    profession: 'UX Designer',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    status: 'Online',
  },
  {
    id: 4,
    name: 'Bob Brown',
    profession: 'Data Scientist',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    status: 'Offline',
  },
  {
    id: 5,
    name: 'Charlie Davis',
    profession: 'DevOps Engineer',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
    status: 'Online',
  },
];

const MatchBar = () => {

  return (
    <div className="bg-white w-[35%] md:w-[35%] lg:w-[25%] p-4 border shadow-lg">
      <Tabs defaultValue="matched" className="">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="matched">Matched</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <UsersList type="pending" />
        </TabsContent>
        <TabsContent value="matched">
          <UsersList type="matched" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface UsersListProps {
  type: string;
}

const UsersList: React.FC<UsersListProps> = ({ type }) => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const filteredUsers = type === "matched" ? users.slice(2, users.length - 1) : users.slice(0, 2)

  return (
    <>
      {filteredUsers.map((user) => (
        <div
          key={user.id}
          className="flex justify-between items-center mt-4 mb-4 hover:bg-gray-200 cursor-pointer px-2"
          onClick={() => setSelectedUser(user.id)}
          style={{
            backgroundColor:
              selectedUser === user.id ? '#f1f1f1' : 'transparent',
            borderRadius: selectedUser === user.id ? '10px' : '0',
          }}
        >
          <div className="flex items-base">
            <img
              src={user.image}
              alt="profile"
              className="w-12 h-16 md:w-16 md:h-20 rounded"
            />
            <div className="ml-4">
              <p className="text-base md:text-md font-semibold">{user.name}</p>
              <p className="text-xs md:text-sm text-gray-500">{user.profession}</p>
              <div className="flex items-center mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${user.status === 'Online' ? 'text-green-500' : 'text-gray-500'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-2-6a2 2 0 114 0 2 2 0 01-4 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <p
                  className={`${user.status === 'Online' ? 'text-green-500' : 'text-gray-500'} ml-1`}
                >
                  {user.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

    </>
  );
}
export default MatchBar;
