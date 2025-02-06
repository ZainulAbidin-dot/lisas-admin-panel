import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useState } from "react";

const initialUsers = [
    {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone_number: "123-456-7890",
        role: "Admin",
        profile_img: "https://via.placeholder.com/50",
    },
    {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        phone_number: "987-654-3210",
        role: "User",
        profile_img: "https://via.placeholder.com/50",
    },
    // Add more users as needed
];

const UsersList = () => {
    const [users, setUsers] = useState(initialUsers);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: string } | null>(null);
    const [filterRole, setFilterRole] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleView = (id: number) => {
        // Implement view logic
        console.log("View user", id);
    };

    const handleEdit = (id: number) => {
        // Implement edit logic
        console.log("Edit user", id);
    };

    const handleDelete = (id: number) => {
        // Implement delete logic
        setUsers(users.filter(user => user.id !== id));
    };

    const handleSort = (key: string) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (sortConfig !== null) {
            if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        }
        return 0;
    });

    const filteredUsers = sortedUsers.filter(user => 
        (filterRole ? user.role === filterRole : true) &&
        (searchQuery ? 
            user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
            : true)
    );

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex justify-between">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="border p-2 rounded"
                />
                <select 
                    value={filterRole} 
                    onChange={(e) => setFilterRole(e.target.value)} 
                    className="border p-2 rounded"
                >
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                </select>
            </div>
            <Table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <TableCaption className="text-lg font-semibold mb-4">A list of users.</TableCaption>
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead className="min-w-[100px] p-4">Profile Img</TableHead>
                        <TableHead className="p-4 cursor-pointer" onClick={() => handleSort('first_name')}>First Name</TableHead>
                        <TableHead className="p-4 cursor-pointer" onClick={() => handleSort('last_name')}>Last Name</TableHead>
                        <TableHead className="p-4 cursor-pointer" onClick={() => handleSort('email')}>Email</TableHead>
                        <TableHead className="p-4 cursor-pointer" onClick={() => handleSort('phone_number')}>Phone Number</TableHead>
                        <TableHead className="p-4 cursor-pointer" onClick={() => handleSort('role')}>Role</TableHead>
                        <TableHead className="p-4 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-b">
                            <TableCell className="p-4">
                                <img src={user.profile_img} alt={`${user.first_name} ${user.last_name}`} className="w-10 h-10 rounded-full" />
                            </TableCell>
                            <TableCell className="p-4 font-medium">{user.first_name}</TableCell>
                            <TableCell className="p-4">{user.last_name}</TableCell>
                            <TableCell className="p-4">{user.email}</TableCell>
                            <TableCell className="p-4">{user.phone_number}</TableCell>
                            <TableCell className="p-4">{user.role}</TableCell>
                            <TableCell className="p-4 text-right">
                                <button onClick={() => handleView(user.id)} className="text-blue-500 hover:underline mr-2">View</button>
                                <button onClick={() => handleEdit(user.id)} className="text-yellow-500 hover:underline mr-2">Edit</button>
                                <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline">Delete</button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter className="bg-gray-100">
                    <TableRow>
                        <TableCell colSpan={6} className="p-4">Total</TableCell>
                        <TableCell className="p-4 text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
};

export default UsersList;