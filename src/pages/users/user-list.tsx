import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { z } from 'zod';
import { useAxiosGet } from "@/hooks/use-axios-get";
import placeholder from '../../assets/images/placeholder.png'

const usersSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    address: z.string(),
    profileImage: z.string().optional()
  })),
  statusCode: z.number(),
  message: z.string(),
  metaData: z.object({
    totalCount: z.number(),
    currentPage: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean()
  }).optional()
})

type TUserListSchema = z.infer<typeof usersSchema>

export function UserList() {
  const {isLoading, data, setData} = useAxiosGet<TUserListSchema>({
    url: '/users',
    validationSchema: usersSchema,
    initialData: null,
  });

  const handleDelete = (id: string) => {
    setData(prev => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.filter(user => user.id !== id)
      }
    });
  };

  console.log(data)
  const handleView = (user: any) => {
    alert(`Viewing user: ${user.name}`);
    // Here you can navigate to a detailed view page or open a modal
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center p-4 text-gray-600">Loading users </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center p-4 text-gray-600">No users found.</div>
      ) : (
        <Table>
          <TableCaption>A list of registered users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">S no.</TableHead>
              <TableHead>Profile Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Billing Address</TableHead>
              <TableHead className="text-center w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell> {user.profileImage ? <img src={user.profileImage} alt="" className="w-[60px]" /> : <img src={placeholder} alt="" className="w-[60px]" />} </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell className="flex gap-2">
                  <Link to={`/user-detail/${user.id}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total Users: {data?.data.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table> 
      )}
    </>
  );
}
