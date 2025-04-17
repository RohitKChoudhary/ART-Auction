
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Package2, 
  MessageSquare, 
  User,
  ArrowRight,
  Palette
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-400">
            ART Auction is a sleek and secure platform where art buyers and sellers connect in real-time. 
            Bid, list, and grow your collection with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Auction */}
          <Card className="art-card col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-medium">Featured Auction</CardTitle>
              <Palette className="h-5 w-5 text-art-purple" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 aspect-square bg-art-charcoal rounded-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Moonlit Reflections"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-2">Moonlit Reflections</h3>
                  <p className="text-gray-400 mb-4">
                    An ethereal abstract painting depicting the dance of moonlight on water. 
                    This piece combines layers of deep blues with shimmering silver accents.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Current Bid</p>
                      <p className="text-lg font-semibold text-art-purple">$2,450</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Ends In</p>
                      <p className="text-lg font-semibold">23h 14m 08s</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Link to="/buyer" className="art-btn-primary flex items-center">
                      View Auction <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Link to="/buyer" className="group">
            <Card className="art-card h-full group-hover:border-art-purple/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Buyer Table</CardTitle>
                <ShoppingBag className="h-5 w-5 text-art-purple" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Browse and bid on available artworks in real-time.
                </p>
                <div className="text-sm text-art-purple group-hover:text-art-purple-light flex items-center">
                  View Auctions <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/seller" className="group">
            <Card className="art-card h-full group-hover:border-art-purple/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Seller Table</CardTitle>
                <Package2 className="h-5 w-5 text-art-purple" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  List your artwork and manage your current auctions.
                </p>
                <div className="text-sm text-art-purple group-hover:text-art-purple-light flex items-center">
                  List Artwork <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/inbox" className="group">
            <Card className="art-card h-full group-hover:border-art-purple/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Inbox</CardTitle>
                <MessageSquare className="h-5 w-5 text-art-purple" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  View notifications and communicate with buyers or sellers.
                </p>
                <div className="text-sm text-art-purple group-hover:text-art-purple-light flex items-center">
                  Check Messages <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/profile" className="group">
            <Card className="art-card h-full group-hover:border-art-purple/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Profile</CardTitle>
                <User className="h-5 w-5 text-art-purple" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Manage your account settings and preferences.
                </p>
                <div className="text-sm text-art-purple group-hover:text-art-purple-light flex items-center">
                  Edit Profile <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recently Added */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="art-card">
                <div className="aspect-square bg-art-charcoal rounded-md overflow-hidden mb-4">
                  <img 
                    src={`https://picsum.photos/seed/${item}/500/500`}
                    alt={`Artwork ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Abstract Harmony #{item}</h3>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-400">Current Bid</span>
                  <span className="font-medium text-art-purple">${1000 + item * 250}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Ends In</span>
                  <span className="font-medium">{7 + item}h 45m</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
