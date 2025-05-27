
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, UserX, UserCheck } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  active: boolean;
  createdAt: string;
}

interface AdminUsersTableProps {
  users: User[];
}

const AdminUsersTable: React.FC<AdminUsersTableProps> = ({ users }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  const isAdmin = (roles: string[]) => {
    return Array.isArray(roles) && roles.includes("ROLE_ADMIN");
  };

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No users found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={isAdmin(user.roles) ? "default" : "secondary"}>
                {isAdmin(user.roles) ? (
                  <>
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </>
                ) : (
                  "User"
                )}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.active ? "default" : "destructive"}>
                {user.active ? (
                  <>
                    <UserCheck className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <UserX className="w-3 h-3 mr-1" />
                    Inactive
                  </>
                )}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(user.createdAt)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline">
                  {user.active ? "Suspend" : "Activate"}
                </Button>
                {!isAdmin(user.roles) && (
                  <Button size="sm" variant="outline">
                    Promote to Admin
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminUsersTable;
