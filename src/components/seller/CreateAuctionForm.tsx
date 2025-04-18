
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { auctionsAPI } from "@/services/api";

const CreateAuctionForm = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [minBid, setMinBid] = useState("");
  const [duration, setDuration] = useState("24");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  return (
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
  );
};

export default CreateAuctionForm;
