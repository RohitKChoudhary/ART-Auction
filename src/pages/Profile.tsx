
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  CreditCard, 
  Bell,
  Shield,
  UserCircle,
  Save,
  CheckCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // User profile form state
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 555-123-4567",
    bio: "Art enthusiast passionate about abstract and contemporary pieces.",
    address: "123 Gallery Street, Art City, AC 10001"
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    bidAlerts: true,
    auctionUpdates: true,
    newListings: false,
    newsletter: true
  });
  
  // Security settings
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [passwordError, setPasswordError] = useState("");
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurity(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types in password fields
    if (name === "newPassword" || name === "confirmPassword") {
      setPasswordError("");
    }
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the updated profile to the server
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
    
    setIsEditing(false);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (security.newPassword !== security.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    // Validate password strength (simple check)
    if (security.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    // In a real app, this would send the password update to the server
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    
    // Reset form
    setSecurity({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };
  
  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the notification settings to the server
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-400">
            Manage your account information and preferences.
          </p>
        </div>
        
        <Card className="art-card">
          <Tabs defaultValue="profile">
            <TabsList className="bg-art-charcoal grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center justify-center">
                <UserCircle className="h-4 w-4 mr-2" /> Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center justify-center">
                <Bell className="h-4 w-4 mr-2" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center justify-center">
                <Shield className="h-4 w-4 mr-2" /> Security
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing 
                      ? "border-art-purple/50 text-art-purple hover:bg-art-purple/10" 
                      : "bg-art-purple hover:bg-art-purple-dark text-white"
                    }
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar section */}
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-2xl bg-art-purple text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-art-purple border-art-purple/50 hover:bg-art-purple/10"
                        >
                          Change Photo
                        </Button>
                      )}
                    </div>
                    
                    {/* Form fields */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center">
                            <User className="h-4 w-4 mr-2" /> Full Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            className="art-input"
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" /> Email Address
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            className="art-input"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" /> Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            className="art-input"
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address" className="flex items-center">
                            <Home className="h-4 w-4 mr-2" /> Address
                          </Label>
                          <Input
                            id="address"
                            name="address"
                            value={profile.address}
                            onChange={handleProfileChange}
                            className="art-input"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="flex items-center">
                          <UserCircle className="h-4 w-4 mr-2" /> Bio
                        </Label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={profile.bio}
                          onChange={handleProfileChange}
                          className="w-full h-24 art-input resize-none"
                          disabled={!isEditing}
                        />
                      </div>
                      
                      {isEditing && (
                        <div className="flex justify-end">
                          <Button 
                            type="submit"
                            className="bg-art-purple hover:bg-art-purple-dark text-white"
                          >
                            <Save className="h-4 w-4 mr-2" /> Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
                
                {!isEditing && (
                  <div className="mt-6 border-t border-border/50 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-art-charcoal border-art-purple/20">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-400 mb-1">Auctions Won</p>
                          <p className="text-2xl font-semibold text-art-purple">3</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-art-charcoal border-art-purple/20">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-400 mb-1">Artworks Listed</p>
                          <p className="text-2xl font-semibold text-art-purple">7</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-art-charcoal border-art-purple/20">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-400 mb-1">Active Bids</p>
                          <p className="text-2xl font-semibold text-art-purple">2</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-gray-400">
                          Receive email notifications about your account activity.
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={() => handleNotificationChange("emailNotifications")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Bid Alerts</Label>
                        <p className="text-sm text-gray-400">
                          Get notified when someone outbids you on an auction.
                        </p>
                      </div>
                      <Switch
                        checked={notifications.bidAlerts}
                        onCheckedChange={() => handleNotificationChange("bidAlerts")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auction Updates</Label>
                        <p className="text-sm text-gray-400">
                          Receive updates about auctions you're participating in.
                        </p>
                      </div>
                      <Switch
                        checked={notifications.auctionUpdates}
                        onCheckedChange={() => handleNotificationChange("auctionUpdates")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">New Listings</Label>
                        <p className="text-sm text-gray-400">
                          Get notified when new artworks matching your interests are listed.
                        </p>
                      </div>
                      <Switch
                        checked={notifications.newListings}
                        onCheckedChange={() => handleNotificationChange("newListings")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Newsletter</Label>
                        <p className="text-sm text-gray-400">
                          Receive our monthly newsletter with art market insights and features.
                        </p>
                      </div>
                      <Switch
                        checked={notifications.newsletter}
                        onCheckedChange={() => handleNotificationChange("newsletter")}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="bg-art-purple hover:bg-art-purple-dark text-white"
                    >
                      <Save className="h-4 w-4 mr-2" /> Save Preferences
                    </Button>
                  </div>
                </form>
              </CardContent>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold">Change Password</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={security.currentPassword}
                        onChange={handleSecurityChange}
                        className="art-input"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={security.newPassword}
                        onChange={handleSecurityChange}
                        className="art-input"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={security.confirmPassword}
                        onChange={handleSecurityChange}
                        className="art-input"
                        required
                      />
                      {passwordError && (
                        <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        className="bg-art-purple hover:bg-art-purple-dark text-white"
                      >
                        <Shield className="h-4 w-4 mr-2" /> Update Password
                      </Button>
                    </div>
                  </form>
                  
                  <div className="border-t border-border/50 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Login Security</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-art-charcoal rounded-lg">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-400">
                            Add an extra layer of security to your account.
                          </p>
                        </div>
                        <Button variant="outline" className="border-art-purple/50 text-art-purple hover:bg-art-purple/10">
                          Enable
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-art-charcoal rounded-lg">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Active Sessions</h4>
                          <p className="text-sm text-gray-400">
                            Manage your active login sessions.
                          </p>
                        </div>
                        <Button variant="outline" className="border-art-purple/50 text-art-purple hover:bg-art-purple/10">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border/50 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Security</h3>
                    
                    <div className="flex items-center justify-between p-4 bg-art-charcoal rounded-lg">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Payment Methods</h4>
                        <p className="text-sm text-gray-400">
                          Manage your saved payment methods.
                        </p>
                      </div>
                      <Button className="bg-art-purple hover:bg-art-purple-dark text-white">
                        <CreditCard className="h-4 w-4 mr-2" /> Add Method
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
