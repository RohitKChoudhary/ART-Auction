
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, PlusCircle, ImagePlus } from "lucide-react";
import { v4 as uuidv4 } from "@tanstack/react-query";

// Mock auctions data for the seller
const initialAuctions = [
  {
    id: "s1",
    title: "Ocean Memories",
    description: "A vibrant abstract painting inspired by ocean waves and coastal memories.",
    minBid: 1200,
    currentBid: 1500,
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
    status: "active",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80",
    bids: 3
  },
  {
    id: "s2",
    title: "Desert Sunset",
    description: "A warm-toned landscape depicting a breathtaking sunset over sand dunes.",
    minBid: 900,
    currentBid: 950,
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), // 36 hours from now
    status: "active",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1176&q=80",
    bids: 2
  },
  {
    id: "s3",
    title: "Midnight Garden",
    description: "A surreal floral composition set against a deep midnight background.",
    minBid: 1500,
    currentBid: 0,
    endTime: "",
    status: "draft",
    image: "https://images.unsplash.com/photo-1508669232496-137b159c1cdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80",
    bids: 0
  },
  {
    id: "s4",
    title: "Urban Reflections",
    description: "A cityscape reflected in rain puddles, captured in impressionist style.",
    minBid: 2000,
    currentBid: 2200,
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    status: "sold",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80",
    bids: 5
  }
];

const Seller: React.FC = () => {
  const { toast } = useToast();
  const [auctions, setAuctions] = useState(initialAuctions);
  const [activeTab, setActiveTab] = useState("active");
  const [newAuction, setNewAuction] = useState({
    title: "",
    description: "",
    minBid: "",
    duration: "3",
    category: "",
    image: ""
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate time remaining
  const getTimeRemaining = (endTime: string) => {
    const total = Date.parse(endTime) - Date.now();
    if (total <= 0) return "Ended";
    
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const minutes = Math.floor((total / 1000 / 60) % 60);
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAuction({ ...newAuction, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewAuction({ ...newAuction, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setNewAuction({ ...newAuction, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAuction.title || !newAuction.description || !newAuction.minBid || !newAuction.category || !newAuction.image) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    // Prepare end time based on duration
    const endTime = new Date(Date.now() + parseInt(newAuction.duration) * 24 * 60 * 60 * 1000).toISOString();
    
    const auction = {
      id: uuidv4(),
      title: newAuction.title,
      description: newAuction.description,
      minBid: parseFloat(newAuction.minBid),
      currentBid: 0,
      endTime,
      status: "active",
      image: newAuction.image || imagePreview,
      bids: 0
    };
    
    setAuctions([auction, ...auctions]);
    
    toast({
      title: "Auction Created",
      description: "Your artwork has been successfully listed for auction.",
    });
    
    // Reset form
    setNewAuction({
      title: "",
      description: "",
      minBid: "",
      duration: "3",
      category: "",
      image: ""
    });
    setImagePreview("");
    setIsDialogOpen(false);
  };

  // Filter auctions based on active tab
  const filteredAuctions = auctions.filter(auction => {
    if (activeTab === "all") return true;
    return auction.status === activeTab;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-gray-400">
              Manage your art listings and track auction progress.
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-art-purple hover:bg-art-purple-dark text-white">
                <PlusCircle className="h-4 w-4 mr-2" /> List New Artwork
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-card border-art-purple/30">
              <DialogHeader>
                <DialogTitle>List Artwork for Auction</DialogTitle>
                <DialogDescription>
                  Provide details about your artwork to list it for auction.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Artwork Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={newAuction.title}
                        onChange={handleInputChange}
                        placeholder="Enter artwork title"
                        className="art-input"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newAuction.description}
                        onChange={handleInputChange}
                        placeholder="Describe your artwork"
                        className="art-input resize-none min-h-[120px]"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minBid">Minimum Bid ($)</Label>
                        <Input
                          id="minBid"
                          name="minBid"
                          type="number"
                          value={newAuction.minBid}
                          onChange={handleInputChange}
                          placeholder="Enter amount"
                          className="art-input"
                          required
                          min="1"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (days)</Label>
                        <Select 
                          value={newAuction.duration} 
                          onValueChange={(value) => handleSelectChange("duration", value)}
                        >
                          <SelectTrigger id="duration" className="art-input">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day</SelectItem>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="5">5 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newAuction.category} 
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger id="category" className="art-input">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="abstract">Abstract</SelectItem>
                          <SelectItem value="landscape">Landscape</SelectItem>
                          <SelectItem value="portrait">Portrait</SelectItem>
                          <SelectItem value="urban">Urban</SelectItem>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="geometric">Geometric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Artwork Image</Label>
                      <div className="border-2 border-dashed border-art-purple/30 rounded-md p-4 flex flex-col items-center justify-center text-center">
                        {imagePreview ? (
                          <div className="w-full aspect-square rounded-md overflow-hidden mb-4">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-square rounded-md overflow-hidden mb-4 bg-art-charcoal flex items-center justify-center">
                            <ImagePlus className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                        
                        <Label 
                          htmlFor="image-upload" 
                          className="cursor-pointer art-btn-outline inline-block"
                        >
                          {imagePreview ? "Change Image" : "Upload Image"}
                        </Label>
                        <Input 
                          id="image-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="border-art-purple/50 text-art-purple hover:bg-art-purple/10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-art-purple hover:bg-art-purple-dark text-white"
                  >
                    List Artwork
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-art-charcoal">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active Auctions</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {filteredAuctions.length === 0 ? (
              <Card className="art-card flex flex-col items-center justify-center py-12">
                <h3 className="text-xl font-medium mb-2">No auctions found</h3>
                <p className="text-gray-400 mb-4">
                  You don't have any {activeTab === "all" ? "" : activeTab} auctions yet.
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-art-purple hover:bg-art-purple-dark text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> List New Artwork
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuctions.map((auction) => (
                  <Card key={auction.id} className="art-card flex flex-col">
                    <div className="aspect-square bg-art-charcoal rounded-md overflow-hidden mb-4">
                      <img 
                        src={auction.image}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-xl">{auction.title}</CardTitle>
                      <div className="flex space-x-2">
                        <span 
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            auction.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            auction.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-0 flex-1">
                      <p className="text-gray-400 text-sm mb-4">{auction.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-400">
                            {auction.status === 'active' ? 'Current Bid' : 
                             auction.status === 'draft' ? 'Minimum Bid' : 
                             'Sold For'}
                          </p>
                          <p className="text-lg font-semibold text-art-purple">
                            ${auction.currentBid > 0 ? auction.currentBid : auction.minBid}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">
                            {auction.status === 'active' ? 'Ends In' : 
                             auction.status === 'draft' ? 'Status' : 
                             'Bids Received'}
                          </p>
                          <p className="text-lg font-semibold flex items-center">
                            {auction.status === 'active' ? (
                              <>
                                <Clock className="h-4 w-4 mr-1" />
                                {getTimeRemaining(auction.endTime)}
                              </>
                            ) : auction.status === 'draft' ? (
                              'Not Listed'
                            ) : (
                              `${auction.bids} bids`
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-0 pt-4">
                      <div className="w-full flex space-x-2">
                        {auction.status === 'draft' ? (
                          <Button 
                            className="w-full bg-art-purple hover:bg-art-purple-dark text-white"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            Edit & List
                          </Button>
                        ) : auction.status === 'active' ? (
                          <Button 
                            variant="outline" 
                            className="w-full border-art-purple/50 text-art-purple hover:bg-art-purple/10"
                          >
                            View Details
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full border-art-purple/50 text-art-purple hover:bg-art-purple/10"
                          >
                            View Sale Details
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Seller;
