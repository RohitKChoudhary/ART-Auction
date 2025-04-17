
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, Clock } from "lucide-react";

// Mock auction data
const mockAuctions = [
  {
    id: "a1",
    title: "Moonlit Reflections",
    artist: "Elena Rivera",
    description: "An ethereal abstract painting depicting the dance of moonlight on water.",
    currentBid: 2450,
    minBidIncrement: 100,
    endTime: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(), // 23 hours from now
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    category: "abstract",
  },
  {
    id: "a2",
    title: "Urban Perspective",
    artist: "Marcus Chen",
    description: "A striking cityscape rendered in bold colors and sharp lines.",
    currentBid: 1800,
    minBidIncrement: 50,
    endTime: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(), // 28 hours from now
    image: "https://images.unsplash.com/photo-1601379329542-33e01a2e2b41?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    category: "urban",
  },
  {
    id: "a3",
    title: "Serene Nature",
    artist: "Sophia Lee",
    description: "A peaceful landscape showcasing the beauty of untouched wilderness.",
    currentBid: 3200,
    minBidIncrement: 150,
    endTime: new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString(), // 42 hours from now
    image: "https://images.unsplash.com/photo-1500965178224-43c70b159434?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    category: "landscape",
  },
  {
    id: "a4",
    title: "Emotional Portrait",
    artist: "James Wilson",
    description: "A powerful portrait that captures raw human emotion.",
    currentBid: 1950,
    minBidIncrement: 75,
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    image: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80",
    category: "portrait",
  },
  {
    id: "a5",
    title: "Digital Dreams",
    artist: "Nora Patel",
    description: "An AI-assisted digital artwork exploring the boundary between reality and imagination.",
    currentBid: 1100,
    minBidIncrement: 50,
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), // 36 hours from now
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80",
    category: "digital",
  },
  {
    id: "a6",
    title: "Geometric Harmony",
    artist: "David Müller",
    description: "A precise arrangement of geometric shapes creating a harmonious composition.",
    currentBid: 2800,
    minBidIncrement: 100,
    endTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18 hours from now
    image: "https://images.unsplash.com/photo-1611538758730-e5ce8aa790ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    category: "geometric",
  },
];

const Buyer: React.FC = () => {
  const { toast } = useToast();
  const [auctions, setAuctions] = useState(mockAuctions);
  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate time remaining
  const getTimeRemaining = (endTime: string) => {
    const total = Date.parse(endTime) - Date.now();
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const minutes = Math.floor((total / 1000 / 60) % 60);
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const handleBidChange = (id: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setBidAmounts({ ...bidAmounts, [id]: numValue });
    }
  };

  const handleBidSubmit = (auction: typeof mockAuctions[0]) => {
    const bidAmount = bidAmounts[auction.id] || 0;
    
    if (bidAmount <= auction.currentBid) {
      toast({
        variant: "destructive",
        title: "Bid too low",
        description: `Your bid must be at least $${auction.currentBid + auction.minBidIncrement}`,
      });
      return;
    }
    
    // In a real app, this would send the bid to the server
    setAuctions(auctions.map(a => 
      a.id === auction.id ? { ...a, currentBid: bidAmount } : a
    ));
    
    toast({
      title: "Bid placed!",
      description: `Your bid of $${bidAmount} for "${auction.title}" has been placed.`,
    });
    
    // Clear the input
    setBidAmounts({ ...bidAmounts, [auction.id]: 0 });
  };

  // Filter auctions based on active tab and search term
  const filteredAuctions = auctions.filter(auction => {
    const matchesTab = activeTab === "all" || auction.category === activeTab;
    const matchesSearch = 
      auction.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      auction.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Buyer Table</h1>
          <p className="text-gray-400">
            Browse and bid on available artworks in real-time.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Input
            className="max-w-sm art-input"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-art-charcoal">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="abstract">Abstract</TabsTrigger>
              <TabsTrigger value="landscape">Landscape</TabsTrigger>
              <TabsTrigger value="portrait">Portrait</TabsTrigger>
              <TabsTrigger value="urban">Urban</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {filteredAuctions.length === 0 ? (
          <Card className="art-card flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-medium mb-2">No auctions found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filters to see more results.
            </p>
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
                  <p className="text-sm text-art-purple">Artist: {auction.artist}</p>
                </CardHeader>
                
                <CardContent className="p-0 flex-1">
                  <p className="text-gray-400 text-sm mb-4">{auction.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Current Bid</p>
                      <p className="text-lg font-semibold text-art-purple">
                        ${auction.currentBid.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Ends In</p>
                      <p className="text-lg font-semibold flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeRemaining(auction.endTime)}
                      </p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-0 pt-4">
                  <div className="w-full flex space-x-2">
                    <Input
                      type="number"
                      placeholder={`Min: $${auction.currentBid + auction.minBidIncrement}`}
                      value={bidAmounts[auction.id] || ""}
                      onChange={(e) => handleBidChange(auction.id, e.target.value)}
                      className="art-input"
                    />
                    <Button 
                      className="bg-art-purple hover:bg-art-purple-dark text-white"
                      onClick={() => handleBidSubmit(auction)}
                    >
                      <ChevronUp className="h-4 w-4 mr-1" /> Bid
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Buyer;
