
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
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { auctionsAPI } from "@/services/api";

const Seller = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
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
      try {
        const response = await auctionsAPI.getSellerAuctions();
        return response.data;
      } catch (error) {
        console.error("Error fetching seller auctions:", error);
        return [];
      }
    }
  });

  // Create auction mutation
  const createAuctionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await auctionsAPI.create(formData);
    },
    onSuccess: () => {
      // Reset form
      setProductName("");
      setProductDescription("");
      setMinBid("");
      setDuration("24");
      setImageFile(null);
      setPreviewUrl(null);

      // Invalidate and refetch auctions queries
      queryClient.invalidateQueries({ queryKey: ["seller-auctions"] });
      queryClient.invalidateQueries({ queryKey: ["recent-auctions"] });

      toast({
        title: "Product listed",
        description: "Your item has been listed for auction successfully."
      });
    },
    onError: (error) => {
      console.error("Error creating auction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to list your product. Please try again."
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
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
      // Create auction request object
      const auctionRequest = {
        name: productName,
        description: productDescription,
        minBid: parseFloat(minBid),
        durationHours: parseInt(duration)
      };

      // Create form data for multipart request
      const formData = new FormData();
      formData.append("auction", new Blob([JSON.stringify(auctionRequest)], { type: "application/json" }));
      formData.append("image", imageFile);

      // Submit the auction
      await createAuctionMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error in form submission:", error);
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
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
                ) : !sellerAuctions || sellerAuctions.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-art-purple/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No auctions found</h3>
                    <p className="text-gray-400">
                      You haven't listed any items for auction yet. Create your first listing to get started!
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>A list of your auction items.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Item</TableHead>
                        <TableHead className="hidden md:table-cell">Current Bid</TableHead>
                        <TableHead className="hidden md:table-cell">Min Bid</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sellerAuctions.map((auction) => (
                        <TableRow key={auction.id}>
                          <TableCell className="font-medium">{auction.name}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            ${auction.currentBid}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            ${auction.minBid}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                auction.status === "ACTIVE" ? "bg-green-600" : 
                                auction.status === "ENDED" ? "bg-blue-600" :
                                "bg-red-600"
                              }
                            >
                              {auction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(auction.endTime)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                toast({
                                  title: "View Details",
                                  description: "Auction details view is coming soon."
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
