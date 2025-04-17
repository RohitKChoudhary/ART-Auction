
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, ShoppingBag, Package2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  // Mock data - this will be replaced with API calls
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        { id: 1, name: "John Doe", email: "john@example.com", status: "active", role: "user" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", status: "active", role: "user" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "blocked", role: "user" },
        { id: 4, name: "Alice Brown", email: "alice@example.com", status: "active", role: "user" },
      ];
    }
  });

  const { data: auctions, isLoading: auctionsLoading } = useQuery({
    queryKey: ["admin-auctions"],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      return [
        { id: 1, name: "Vintage Watch", seller: "Jane Smith", currentBid: 250, status: "active", endTime: new Date(Date.now() + 10800000).toISOString() },
        { id: 2, name: "Modern Painting", seller: "John Doe", currentBid: 1200, status: "active", endTime: new Date(Date.now() + 7200000).toISOString() },
        { id: 3, name: "Antique Vase", seller: "Alice Brown", currentBid: 800, status: "ended", endTime: new Date(Date.now() - 3600000).toISOString() },
        { id: 4, name: "Designer Chair", seller: "Bob Johnson", currentBid: 450, status: "cancelled", endTime: new Date(Date.now() + 14400000).toISOString() }
      ];
    }
  });

  const toggleUserStatus = (userId: number) => {
    toast({
      title: "User status updated",
      description: "The user's status has been toggled successfully.",
    });
  };

  const cancelAuction = (auctionId: number) => {
    toast({
      title: "Auction cancelled",
      description: "The auction has been cancelled successfully.",
    });
  };

  const promoteToAdmin = (userId: number) => {
    toast({
      title: "Role updated",
      description: "The user has been promoted to admin.",
    });
  };

  if (!user || user.role !== "admin") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
            <p className="mt-2 text-gray-400">You do not have permission to view this page.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <Badge variant="outline" className="bg-art-purple text-white px-3 py-1">
            Admin
          </Badge>
        </div>

        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            className={activeTab === "users" ? "bg-art-purple" : ""}
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-2 h-4 w-4" /> Users
          </Button>
          <Button
            variant={activeTab === "auctions" ? "default" : "outline"}
            className={activeTab === "auctions" ? "bg-art-purple" : ""}
            onClick={() => setActiveTab("auctions")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" /> Auctions
          </Button>
        </div>

        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>
                Manage user accounts, permissions, and access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-art-purple" />
                </div>
              ) : (
                <Table>
                  <TableCaption>A list of all registered users.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge className={user.status === "active" ? "bg-green-600" : "bg-red-600"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Switch
                            checked={user.status === "active"}
                            onCheckedChange={() => toggleUserStatus(user.id)}
                          />
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => promoteToAdmin(user.id)}
                            disabled={user.role === "admin"}
                          >
                            Make Admin
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "auctions" && (
          <Card>
            <CardHeader>
              <CardTitle>Manage Auctions</CardTitle>
              <CardDescription>
                View and manage all auctions on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auctionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-art-purple" />
                </div>
              ) : (
                <Table>
                  <TableCaption>A list of all auctions.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Current Bid</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auctions?.map((auction) => (
                      <TableRow key={auction.id}>
                        <TableCell className="font-medium">{auction.name}</TableCell>
                        <TableCell>{auction.seller}</TableCell>
                        <TableCell>${auction.currentBid}</TableCell>
                        <TableCell>{new Date(auction.endTime).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              auction.status === "active" ? "bg-green-600" : 
                              auction.status === "ended" ? "bg-blue-600" :
                              "bg-red-600"
                            }
                          >
                            {auction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => cancelAuction(auction.id)}
                            disabled={auction.status !== "active"}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Admin;
