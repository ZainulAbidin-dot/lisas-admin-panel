import { useState } from 'react';

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAxiosGet } from '@/hooks/use-axios-get';
import { getInitials } from '@/lib/utils';

const usersSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      phoneNumber: z.string(),
      address: z.string(),
      profileImage: z.string().optional(),
    })
  ),
  statusCode: z.number(),
  message: z.string(),
  metadata: z.object({
    totalCount: z.number(),
    currentPage: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

type TUserListSchema = z.infer<typeof usersSchema>;

export function UserList() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    isLoading,
    data: usersState,
    setData,
  } = useAxiosGet<TUserListSchema>({
    url: `/users?page=${currentPage}&page-size=10`,
    validationSchema: usersSchema,
    initialData: null,
  });

  const handleDelete = (id: string) => {
    setData((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.filter((user) => user.id !== id),
      };
    });
  };

  if (isLoading) {
    return <div className="text-center p-4 text-gray-600">Loading users </div>;
  }

  if (!usersState || usersState.data.length === 0) {
    return <div className="text-center p-4 text-gray-600">No users found.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
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
          {usersState.data.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {(usersState.metadata.currentPage - 1) *
                  usersState.metadata.pageSize +
                  index +
                  1}
              </TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/user-detail/${user.id}`}>View</Link>
                </Button>
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
            <TableCell colSpan={7}>
              <Pagination
                metadata={usersState.metadata}
                onPageChange={setCurrentPage}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

function Pagination({
  metadata: { totalPages, currentPage, pageSize },
  onPageChange,
}: {
  metadata: TUserListSchema['metadata'];
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}) {
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const summary = (
    <p className="text-sm text-gray-600 font-medium">
      Page {currentPage} of {totalPages} ({pageSize * totalPages} items)
    </p>
  );

  if (totalPages <= 1) {
    return <div className="flex items-center justify-between">{summary}</div>;
  }

  if (totalPages === 2) {
    return (
      <div className="flex items-center justify-between">
        {summary}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageClick(currentPage - 1)}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageClick(currentPage + 1)}
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (totalPages <= 6) {
    return (
      <div className="flex items-center justify-between">
        {summary}
        <div className="flex items-center gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? 'default' : 'outline'}
              size="sm"
              className="font-mono text-center"
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const getPagination = () => {
    const pages = [];
    const range = 2; // Number of pages to show on each side of the current page

    pages.push(1); // Always show first page

    if (currentPage - range > 2) {
      pages.push('...');
    }

    for (
      let i = Math.max(2, currentPage - range);
      i <= Math.min(totalPages - 1, currentPage + range);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage + range < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages); // Always show last page
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      {summary}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageClick(currentPage - 1)}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          {getPagination().map((page, index) => (
            <Button
              key={index}
              variant={
                typeof page !== 'number'
                  ? 'ghost'
                  : currentPage === page
                    ? 'default'
                    : 'outline'
              }
              className="font-mono text-center"
              size="sm"
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageClick(currentPage + 1)}
        >
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
