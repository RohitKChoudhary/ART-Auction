
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Package2, 
  MessageSquare, 
  User,
  ArrowRight
} from "lucide-react";

const QuickLinks: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Link to="/buyer" className="group">
        <Card className="art-card h-full group-hover:border-art-purple/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium">Buyer Table</CardTitle>
            <ShoppingBag className="h-5 w-5 text-art-purple" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Browse and bid on available auctions in real-time.
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
              List your items and manage your current auctions.
            </p>
            <div className="text-sm text-art-purple group-hover:text-art-purple-light flex items-center">
              List Items <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
  );
};

export default QuickLinks;
