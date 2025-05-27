
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
  const [category, setCategory] = useState("art");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const createAuctionMutation = useMutation({
    mutationFn: async (auctionData: any) => {
      console.log("Creating auction with data:", auctionData);
      return await auctionsAPI.create(auctionData);
    },
    onSuccess: (response) => {
      console.log("Auction created successfully:", response.data);
      
      // Reset form
      setProductName("");
      setProductDescription("");
      setMinBid("");
      setDuration("24");
      setCategory("art");
      setImageFile(null);
      setPreviewUrl(null);

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["seller-auctions"] });
      queryClient.invalidateQueries({ queryKey: ["active-auctions"] });
      queryClient.invalidateQueries({ queryKey: ["recent-auctions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-auctions"] });

      toast({
        title: "Auction Created",
        description: "Your item has been listed for auction successfully."
      });
    },
    onError: (error: any) => {
      console.error("Error creating auction:", error);
      const errorMessage = error.response?.data || "Failed to create auction. Please try again.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image under 5MB."
        });
        return;
      }

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
    
    if (!productName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter a product name."
      });
      return;
    }

    if (!productDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter a product description."
      });
      return;
    }

    if (!minBid || parseFloat(minBid) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid bid amount",
        description: "Please enter a valid minimum bid amount."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", productName.trim());
      formData.append("description", productDescription.trim());
      formData.append("minBid", minBid);
      formData.append("durationHours", duration);
      formData.append("category", category);
      
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        // Create a simple placeholder blob
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, 400, 300);
          ctx.fillStyle = '#999';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('No Image', 200, 150);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            formData.append("image", blob, "placeholder.png");
            createAuctionMutation.mutate(formData);
          }
        });
        return;
      }

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
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="art-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productDescription">Product Description *</Label>
            <Textarea
              id="productDescription"
              placeholder="Describe your product in detail"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="art-input min-h-32"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBid">Minimum Bid ($) *</Label>
              <Input
                id="minBid"
                type="number"
                placeholder="0.00"
                min="1"
                step="0.01"
                value={minBid}
                onChange={(e) => setMinBid(e.target.value)}
                className="art-input"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Auction Duration (hours) *</Label>
              <Input
                id="duration"
                type="number"
                placeholder="24"
                min="1"
                max="168"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="art-input"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-art-dark border border-gray-600 rounded-md text-white"
            >
              <option value="art">Art</option>
              <option value="collectibles">Collectibles</option>
              <option value="antiques">Antiques</option>
              <option value="jewelry">Jewelry</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productImage">Product Image (Optional)</Label>
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
