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

const subscriptions = [
  {
    id: "SUB001",
    name: "John Doe",
    email: "john@example.com",
    subscriptionType: "Premium",
    currentStatus: "Active",
    totalSpent: "$500.00",
  },
  {
    id: "SUB002",
    name: "Jane Smith",
    email: "jane@example.com",
    subscriptionType: "Standard",
    currentStatus: "Inactive",
    totalSpent: "$200.00",
  },
  {
    id: "SUB003",
    name: "Alice Johnson",
    email: "alice@example.com",
    subscriptionType: "Basic",
    currentStatus: "Active",
    totalSpent: "$100.00",
  },
  {
    id: "SUB004",
    name: "Bob Brown",
    email: "bob@example.com",
    subscriptionType: "Premium",
    currentStatus: "Pending",
    totalSpent: "$400.00",
  },
];

export function SubscriptionList() {
  const handleDelete = (id: string) => {
    console.log(`Deleting subscription with ID: ${id}`);
    // Implement your delete logic here
  };

  return (
    <Table>

      <TableCaption>A list of user subscriptions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Subscription Type</TableHead>
          <TableHead>Current Status</TableHead>
          <TableHead className="text-right">Total Spent</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((subscription) => (
          <TableRow key={subscription.id}>
            <TableCell className="font-medium">{subscription.id}</TableCell>
            <TableCell>{subscription.name}</TableCell>
            <TableCell>{subscription.email}</TableCell>
            <TableCell>{subscription.subscriptionType}</TableCell>
            <TableCell>{subscription.currentStatus}</TableCell>
            <TableCell className="text-right">{subscription.totalSpent}</TableCell>
            <TableCell className="text-center space-x-2">
              <Link to={`/subscription-detail/${subscription.id}`}>
                <Button size="sm" variant="outline">View</Button>
              </Link>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(subscription.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>Total Subscriptions: {subscriptions.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
