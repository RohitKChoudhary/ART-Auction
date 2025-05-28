
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usersAPI, auctionsAPI } from "@/services/api";
import { Loader2, Users, Gavel, TrendingUp } from "lucide-react";
import AdminUsersTable from "./AdminUsersTable";
import AdminAuctionsTable from "./AdminAuctionsTable";

const AdminDashboard: React.FC = () => {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        const response = await usersAPI.getAllUsers();
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    }
  });

  const { data: auctions, isLoading: auctionsLoading } = useQuery({
    queryKey: ["admin-auctions"], 
    queryFn: async () => {
      try {
        const response = await auctionsAPI.getAll();
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Error fetching auctions:", error);
        return [];
      }
    }
  });

  const totalUsers = Array.isArray(users) ? users.length : 0;
  const activeUsers = totalUsers; // All users are active by default in our schema
  const totalAuctions = Array.isArray(auctions) ? auctions.length : 0;
  const activeAuctions = Array.isArray(auctions) ? auctions.filter(auction => auction.status === "ACTIVE").length : 0;

  if (usersLoading || auctionsLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-art-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAuctions}</div>
            <p className="text-xs text-muted-foreground">
              {activeAuctions} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              User activity rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage registered users and their permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminUsersTable users={users || []} />
        </CardContent>
      </Card>

      {/* Auctions Management */}
      <Card>
        <CardHeader>
          <CardTitle>Auction Management</CardTitle>
          <CardDescription>
            Monitor and manage all auction listings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminAuctionsTable auctions={auctions || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
