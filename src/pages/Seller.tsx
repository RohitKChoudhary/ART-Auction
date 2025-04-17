
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Seller = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [minBid, setMinBid] = useState("");
  const [duration, setDuration] = useState("24");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch seller's auctions
  const { data: sellerAuctions, isLoading } = useQuery({
    queryKey: ["seller-auctions"],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        { 
          id: 1, 
          name: "Vintage Camera", 
          description: "A beautiful vintage camera from the 1950s.",
          minBid: 200,
          currentBid: 230,
          status: "active",
          bids: 3,
          endTime: new Date(Date.now() + 86400000).toISOString()
        },
        { 
          id: 2, 
          name: "Art Deco Lamp", 
          description: "Elegant Art Deco lamp with brass finish.",
          minBid: 150,
          currentBid: 150,
          status: "active",
          bids: 0,
          endTime: new Date(Date.now() + 172800000).toISOString()
        },
        { 
          id: 3, 
          name: "Antique Clock", 
          description: "19th century mahogany mantel clock.",
          minBid: 300,
          currentBid: 450,
          status: "ended",
          bids: 8,
          endTime: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !productDescription || !minBid || !duration) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields."
      });
      return;
    }

    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "Missing image",
        description: "Please upload an image for your product."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Reset form
      setProductName("");
      setProductDescription("");
      setMinBid("");
      setDuration("24");
      setImageFile(null);
      setPreviewUrl(null);

      toast({
        title: "Product listed",
        description: "Your item has been listed for auction successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to list your product. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            List new items for auction and manage your active listings.
          </p>
        </div>
        
        <Tabs defaultValue="new-listing" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="new-listing">New Listing</TabsTrigger>
            <TabsTrigger value="my-auctions">My Auctions</TabsTrigger>
          </TabsList>

          <TabsContent value="new-listing" className="mt-6">
            <Card className="border-art-purple/30 bg-art-dark-blue">
              <CardHeader>
                <CardTitle>List a New Item</CardTitle>
                <CardDescription>
                  Create a new auction listing with your product details.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      placeholder="Enter product name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="art-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Product Description</Label>
                    <Textarea
                      id="productDescription"
                      placeholder="Describe your product in detail"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      className="art-input min-h-32"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minBid">Minimum Bid ($)</Label>
                      <Input
                        id="minBid"
                        type="number"
                        placeholder="0.00"
                        min="1"
                        value={minBid}
                        onChange={(e) => setMinBid(e.target.value)}
                        className="art-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Auction Duration (hours)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="24"
                        min="1"
                        max="168"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="art-input"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productImage">Product Image</Label>
                    <div className="border-2 border-dashed border-gray-600 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-art-purple transition-colors"
                      onClick={() => document.getElementById('productImage')?.click()}
                    >
                      <Input
                        id="productImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      
                      {previewUrl ? (
                        <div className="space-y-4">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-h-40 rounded"
                          />
                          <p className="text-sm text-center text-muted-foreground">Click to change image</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-gray-500 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload product image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (max 5MB)</p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-art-purple hover:bg-art-purple-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Listing...
                      </>
                    ) : (
                      "Create Auction Listing"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="my-auctions" className="mt-6">
            <Card className="border-art-purple/30 bg-art-dark-blue">
              <CardHeader>
                <CardTitle>My Auction Listings</CardTitle>
                <CardDescription>
                  Manage your active and past auction listings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-art-purple" />
                  </div>
                ) : (
                  <Table>
                    <TableCaption>A list of your auction items.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Item</TableHead>
                        <TableHead className="hidden md:table-cell">Current Bid</TableHead>
                        <TableHead className="hidden md:table-cell">Bids</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sellerAuctions?.map((auction) => (
                        <TableRow key={auction.id}>
                          <TableCell className="font-medium">{auction.name}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            ${auction.currentBid}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {auction.bids}
                          </TableCell>
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
                          <TableCell>
                            {new Date(auction.endTime).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="outline"
                              disabled={auction.status !== "active"}
                              onClick={() => {
                                toast({
                                  title: "Not implemented",
                                  description: "This feature is not yet implemented."
                                });
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Seller;
