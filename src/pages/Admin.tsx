
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Badge, 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";
import { 
  MoreHorizontal, 
  Search, 
  Users, 
  Package2, 
  AlertTriangle,
  Ban,
  CheckCircle,
  UserCheck,
  UserX,
  Trash,
  RefreshCw,
  Shield
} from "lucide-react";

// Mock users data
const mockUsers = [
  {
    id: "u1",
    name: "John Smith",
    email: "john.smith@example.com",
    status: "active",
    role: "user",
    registered: "2023-12-10",
    lastActive: "2025-04-15",
    auctions: 5,
    bids: 12
  },
  {
    id: "u2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    status: "active",
    role: "user",
    registered: "2024-01-15",
    lastActive: "2025-04-16",
    auctions: 8,
    bids: 3
  },
  {
    id: "u3",
    name: "Michael Lee",
    email: "michael.lee@example.com",
    status: "blocked",
    role: "user",
    registered: "2023-11-22",
    lastActive: "2025-03-30",
    auctions: 2,
    bids: 15
  },
  {
    id: "u4",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    status: "active",
    role: "admin",
    registered: "2023-10-05",
    lastActive: "2025-04-17",
    auctions: 0,
    bids: 0
  },
  {
    id: "u5",
    name: "James Anderson",
    email: "james.anderson@example.com",
    status: "inactive",
    role: "user",
    registered: "2024-02-08",
    lastActive: "2025-03-10",
    auctions: 3,
    bids: 7
  }
];

// Mock auctions data
const mockAuctions = [
  {
    id: "a1",
    title: "Moonlit Reflections",
    seller: "Elena Rivera",
    status: "active",
    currentBid: 2450,
    bids: 8,
    endTime: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    listed: "2025-04-15"
  },
  {
    id: "a2",
    title: "Urban Perspective",
    seller: "Marcus Chen",
    status: "active",
    currentBid: 1800,
    bids: 5,
    endTime: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(),
    listed: "2025-04-14"
  },
  {
    id: "a3",
    title: "Serene Nature",
    seller: "Sophia Lee",
    status: "suspended",
    currentBid: 3200,
    bids: 12,
    endTime: new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString(),
    listed: "2025-04-10"
  },
  {
    id: "a4",
    title: "Emotional Portrait",
    seller: "James Wilson",
    status: "active",
    currentBid: 1950,
    bids: 6,
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    listed: "2025-04-13"
  },
  {
    id: "a5",
    title: "Digital Dreams",
    seller: "Nora Patel",
    status: "completed",
    currentBid: 1100,
    bids: 4,
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    listed: "2025-04-12"
  },
  {
    id: "a6",
    title: "Geometric Harmony",
    seller: "David Müller",
    status: "completed",
    currentBid: 2800,
    bids: 9,
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    listed: "2025-04-11"
  }
];

// Admin platform statistics
const platformStats = {
  totalUsers: 126,
  activeUsers: 98,
  totalAuctions: 214,
  activeAuctions: 45,
  completedAuctions: 169,
  totalBids: 1852,
  totalValue: 321500
};

const Admin: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [auctions, setAuctions] = useState(mockAuctions);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionType, setActionType] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Format date to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Calculate time remaining
  const getTimeRemaining = (endTime: string) => {
    const total = Date.parse(endTime) - Date.now();
    if (total <= 0) return "Ended";
    
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h`;
  };

  // Handle user action (block, unblock, make admin, etc.)
  const handleUserAction = (user: typeof mockUsers[0], action: string) => {
    setActionType(action);
    setActionTarget(user);
    setIsDialogOpen(true);
  };

  // Handle auction action (suspend, resume, delete)
  const handleAuctionAction = (auction: typeof mockAuctions[0], action: string) => {
    setActionType(action);
    setActionTarget(auction);
    setIsDialogOpen(true);
  };

  // Confirm admin action
  const confirmAction = () => {
    if (!actionType || !actionTarget) return;

    switch (actionType) {
      case "block":
        setUsers(users.map(u => 
          u.id === actionTarget.id ? { ...u, status: "blocked" } : u
        ));
        toast({
          title: "User Blocked",
          description: `${actionTarget.name} has been blocked from the platform.`,
        });
        break;
      case "unblock":
        setUsers(users.map(u => 
          u.id === actionTarget.id ? { ...u, status: "active" } : u
        ));
        toast({
          title: "User Unblocked",
          description: `${actionTarget.name} has been unblocked and can now access the platform.`,
        });
        break;
      case "makeAdmin":
        setUsers(users.map(u => 
          u.id === actionTarget.id ? { ...u, role: "admin" } : u
        ));
        toast({
          title: "Admin Role Assigned",
          description: `${actionTarget.name} has been given administrator privileges.`,
        });
        break;
      case "removeAdmin":
        setUsers(users.map(u => 
          u.id === actionTarget.id ? { ...u, role: "user" } : u
        ));
        toast({
          title: "Admin Role Removed",
          description: `${actionTarget.name} is no longer an administrator.`,
        });
        break;
      case "suspendAuction":
        setAuctions(auctions.map(a => 
          a.id === actionTarget.id ? { ...a, status: "suspended" } : a
        ));
        toast({
          title: "Auction Suspended",
          description: `"${actionTarget.title}" has been suspended and is no longer visible to users.`,
        });
        break;
      case "resumeAuction":
        setAuctions(auctions.map(a => 
          a.id === actionTarget.id ? { ...a, status: "active" } : a
        ));
        toast({
          title: "Auction Resumed",
          description: `"${actionTarget.title}" has been resumed and is now visible to users.`,
        });
        break;
      case "deleteAuction":
        setAuctions(auctions.filter(a => a.id !== actionTarget.id));
        toast({
          title: "Auction Deleted",
          description: `"${actionTarget.title}" has been permanently deleted from the platform.`,
        });
        break;
      default:
        break;
    }

    setIsDialogOpen(false);
    setActionType(null);
    setActionTarget(null);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter auctions based on search term
  const filteredAuctions = auctions.filter(auction => 
    auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auction.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get color for user status badge
  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "blocked":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  // Get color for auction status badge
  const getAuctionStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "suspended":
        return "bg-red-500/20 text-red-400";
      case "completed":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">
              Monitor and manage all aspects of the ART Auction platform.
            </p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          <Card className="art-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Total Users</p>
              <p className="text-2xl font-semibold text-art-purple">{platformStats.totalUsers}</p>
            </CardContent>
          </Card>
          
          <Card className="art-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Active Users</p>
              <p className="text-2xl font-semibold text-art-purple">{platformStats.activeUsers}</p>
            </CardContent>
          </Card>
          
          <Card className="art-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Total Auctions</p>
              <p className="text-2xl font-semibold text-art-purple">{platformStats.totalAuctions}</p>
            </CardContent>
          </Card>
          
          <Card className="art-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Active Auctions</p>
              <p className="text-2xl font-semibold text-art-purple">{platformStats.activeAuctions}</p>
            </CardContent>
          </Card>
          
          <Card className="art-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Completed</p>
              <p className="text-2xl font-semibold text-art-purple">{platformStats.completedAuctions}</p>
            </CardContent>
          </Card>
          
          <Card className="art-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Total Bids</p>
              <p className="text-2xl font-semibold text-art-purple">{platformStats.totalBids}</p>
            </CardContent>
          </Card>
          
          <Card className="art-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Total Value</p>
              <p className="text-2xl font-semibold text-art-purple">${platformStats.totalValue.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <Card className="art-card">
          <Tabs defaultValue="users">
            <TabsList className="bg-art-charcoal">
              <TabsTrigger value="users" className="flex items-center">
                <Users className="h-4 w-4 mr-2" /> Users
              </TabsTrigger>
              <TabsTrigger value="auctions" className="flex items-center">
                <Package2 className="h-4 w-4 mr-2" /> Auctions
              </TabsTrigger>
            </TabsList>
            
            {/* Users Tab */}
            <TabsContent value="users">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>User Management</CardTitle>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="art-input pl-9 w-full sm:w-64"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border border-border/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-art-charcoal hover:bg-art-charcoal">
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-gray-400">No users found matching your search criteria.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getUserStatusColor(user.status)}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.role === "admin" ? (
                                <Badge className="bg-art-purple/20 text-art-purple">Admin</Badge>
                              ) : (
                                "User"
                              )}
                            </TableCell>
                            <TableCell>{formatDate(user.registered)}</TableCell>
                            <TableCell>{formatDate(user.lastActive)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {user.status === "blocked" ? (
                                    <DropdownMenuItem onClick={() => handleUserAction(user, "unblock")}>
                                      <CheckCircle className="h-4 w-4 mr-2" /> Unblock User
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleUserAction(user, "block")}>
                                      <Ban className="h-4 w-4 mr-2" /> Block User
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  {user.role === "admin" ? (
                                    <DropdownMenuItem onClick={() => handleUserAction(user, "removeAdmin")}>
                                      <UserX className="h-4 w-4 mr-2" /> Remove Admin
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleUserAction(user, "makeAdmin")}>
                                      <UserCheck className="h-4 w-4 mr-2" /> Make Admin
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </TabsContent>
            
            {/* Auctions Tab */}
            <TabsContent value="auctions">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Auction Management</CardTitle>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="art-input pl-9 w-full sm:w-64"
                      placeholder="Search auctions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border border-border/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-art-charcoal hover:bg-art-charcoal">
                        <TableHead>Title</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Current Bid</TableHead>
                        <TableHead>Bids</TableHead>
                        <TableHead>Ends In</TableHead>
                        <TableHead>Listed Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAuctions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-gray-400">No auctions found matching your search criteria.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAuctions.map((auction) => (
                          <TableRow key={auction.id}>
                            <TableCell>{auction.title}</TableCell>
                            <TableCell>{auction.seller}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getAuctionStatusColor(auction.status)}>
                                {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>${auction.currentBid.toLocaleString()}</TableCell>
                            <TableCell>{auction.bids}</TableCell>
                            <TableCell>
                              {auction.status === "completed" ? "Ended" : getTimeRemaining(auction.endTime)}
                            </TableCell>
                            <TableCell>{formatDate(auction.listed)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {auction.status === "suspended" ? (
                                    <DropdownMenuItem onClick={() => handleAuctionAction(auction, "resumeAuction")}>
                                      <RefreshCw className="h-4 w-4 mr-2" /> Resume Auction
                                    </DropdownMenuItem>
                                  ) : auction.status === "active" ? (
                                    <DropdownMenuItem onClick={() => handleAuctionAction(auction, "suspendAuction")}>
                                      <Ban className="h-4 w-4 mr-2" /> Suspend Auction
                                    </DropdownMenuItem>
                                  ) : null}
                                  <DropdownMenuItem onClick={() => handleAuctionAction(auction, "deleteAuction")}>
                                    <Trash className="h-4 w-4 mr-2" /> Delete Auction
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Action Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-card border-art-purple/30">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "block" && "Block User"}
              {actionType === "unblock" && "Unblock User"}
              {actionType === "makeAdmin" && "Make Admin"}
              {actionType === "removeAdmin" && "Remove Admin"}
              {actionType === "suspendAuction" && "Suspend Auction"}
              {actionType === "resumeAuction" && "Resume Auction"}
              {actionType === "deleteAuction" && "Delete Auction"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "block" && `Are you sure you want to block ${actionTarget?.name}? They will no longer be able to access the platform.`}
              {actionType === "unblock" && `Are you sure you want to unblock ${actionTarget?.name}? They will regain access to the platform.`}
              {actionType === "makeAdmin" && `Are you sure you want to make ${actionTarget?.name} an administrator? They will have full access to the admin panel.`}
              {actionType === "removeAdmin" && `Are you sure you want to remove admin privileges from ${actionTarget?.name}?`}
              {actionType === "suspendAuction" && `Are you sure you want to suspend "${actionTarget?.title}"? It will be hidden from all users.`}
              {actionType === "resumeAuction" && `Are you sure you want to resume "${actionTarget?.title}"? It will be visible to all users again.`}
              {actionType === "deleteAuction" && `Are you sure you want to delete "${actionTarget?.title}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-art-purple/50 text-art-purple hover:bg-art-purple/10"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                actionType?.includes("delete") || actionType?.includes("block") || actionType?.includes("suspend")
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-art-purple hover:bg-art-purple-dark text-white"
              }
            >
              {actionType?.includes("delete") ? (
                <>
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </>
              ) : actionType?.includes("block") || actionType?.includes("suspend") ? (
                <>
                  <Ban className="h-4 w-4 mr-2" /> Confirm
                </>
              ) : actionType?.includes("unblock") || actionType?.includes("resume") ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" /> Confirm
                </>
              ) : actionType?.includes("makeAdmin") ? (
                <>
                  <Shield className="h-4 w-4 mr-2" /> Confirm
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Admin;
