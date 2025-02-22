import { useState } from 'react';

import { Link } from 'react-router-dom';
import { z } from 'zod';

import { PaginationBar } from '@/components/composed/pagination-bar';
import { LoadingState } from '@/components/loading-state';
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
import { metadataSchema } from '@/lib/meta-data-schema';

const subscriptionsSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      currentPeriodStart: z.string(),
      currentPeriodEnd: z.string(),
      plan: z.string(),
      user: z.object({
        name: z.string(),
        email: z.string(),
      }),
    })
  ),
  statusCode: z.number(),
  message: z.string(),
  metadata: metadataSchema,
});

type TSubscriptionsSchema = z.infer<typeof subscriptionsSchema>;

export function SubscriptionList() {
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, data: subscriptionsState } =
    useAxiosGet<TSubscriptionsSchema>({
      url: `/api/subscriptions?page=${currentPage}`,
      initialData: null,
      validationSchema: subscriptionsSchema,
    });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!subscriptionsState || subscriptionsState.data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        No subscriptions found.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Subscriptions</h1>
      <Table>
        <TableCaption>List of subscriptions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">S no.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[150px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptionsState.data.map((subscription, index) => (
            <TableRow key={subscription.id}>
              <TableCell className="font-medium">
                {(subscriptionsState.metadata.currentPage - 1) *
                  subscriptionsState.metadata.pageSize +
                  index +
                  1}
              </TableCell>
              <TableCell>{subscription.user.name}</TableCell>
              <TableCell>{subscription.user.email}</TableCell>
              <TableCell>{subscription.plan}</TableCell>
              <TableCell>
                {new Date(subscription.currentPeriodEnd) > new Date()
                  ? 'active'
                  : 'expired'}
              </TableCell>
              <TableCell className="">
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/user-detail/${subscription.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              <PaginationBar
                metadata={subscriptionsState.metadata}
                onPageChange={setCurrentPage}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
