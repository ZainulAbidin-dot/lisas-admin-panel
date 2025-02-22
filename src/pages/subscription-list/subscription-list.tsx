import { useState } from 'react';

import { format } from 'date-fns';
import { z } from 'zod';

import { PaginationBar } from '@/components/composed/pagination-bar';
import { LoadingState } from '@/components/loading-state';
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
      currentPeriodStart: z.string().transform((val) => new Date(val)),
      currentPeriodEnd: z.string().transform((val) => new Date(val)),
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

  console.log({
    isLoading,
    subscriptionsState,
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
            <TableHead>Period</TableHead>
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
                {subscription.currentPeriodEnd > new Date() ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-red-500">Expired</span>
                )}
              </TableCell>
              <TableCell>
                {format(subscription.currentPeriodStart, 'dd MMM yyyy')} -{' '}
                {format(subscription.currentPeriodEnd, 'dd MMM yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
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
