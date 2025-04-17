
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Search,
  ChevronRight,
  Send
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Mock messages data
const initialMessages = [
  {
    id: "m1",
    type: "notification",
    title: "Congratulations! Your bid won",
    content: "You have successfully won the auction for 'Urban Reflections'. Please contact the seller at john.artist@example.com to arrange payment and delivery.",
    relatedItem: "Urban Reflections",
    sender: "system",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    email: "john.artist@example.com",
    instructionType: "buyer"
  },
  {
    id: "m2",
    type: "message",
    title: "Question about shipping",
    content: "Hi there, I'm interested in your 'Ocean Memories' piece. Could you let me know what shipping options are available if I win the auction? Thanks!",
    relatedItem: "Ocean Memories",
    sender: "Sarah Johnson",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    read: true,
    email: "sarah.johnson@example.com",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    id: "m3",
    type: "notification",
    title: "New bid on your artwork",
    content: "Someone has placed a bid of $1,500 on your 'Ocean Memories' artwork.",
    relatedItem: "Ocean Memories",
    sender: "system",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    read: true,
    email: ""
  },
  {
    id: "m4",
    type: "notification",
    title: "Artwork sold!",
    content: "Your artwork 'Desert Sunset' has been sold for $950. The buyer's email is emily.collector@example.com. Please contact them to arrange payment and delivery. Remember to request 25% of the final price as per our platform policy.",
    relatedItem: "Desert Sunset",
    sender: "system",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: false,
    email: "emily.collector@example.com",
    instructionType: "seller"
  },
  {
    id: "m5",
    type: "message",
    title: "Follow-up on auction",
    content: "Hello, I just wanted to confirm that you received my payment for the 'Geometric Harmony' piece. Please let me know when I can expect shipping details. Thank you!",
    relatedItem: "Geometric Harmony",
    sender: "Michael Lee",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: true,
    email: "michael.lee@example.com",
    avatar: "https://i.pravatar.cc/150?u=michael"
  }
];

const Inbox: React.FC = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<typeof initialMessages[0] | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }
  };

  // Handle marking a message as read
  const handleMessageClick = (message: typeof initialMessages[0]) => {
    setSelectedMessage(message);
    
    // Mark as read if it was unread
    if (!message.read) {
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      ));
    }
  };

  // Handle sending a reply
  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    // In a real app, this would send the message to the server
    // Here we just close the dialog and reset the reply text
    setIsDialogOpen(false);
    setReplyText("");
    
    // Show success notification or update UI as needed
  };

  // Filter messages based on active tab and search term
  const filteredMessages = messages.filter(message => {
    // Filter by tab
    const tabFilter = 
      activeTab === "all" || 
      (activeTab === "unread" && !message.read) ||
      (activeTab === "notifications" && message.type === "notification") ||
      (activeTab === "messages" && message.type === "message");
    
    // Filter by search term
    const searchFilter = 
      message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.relatedItem.toLowerCase().includes(searchTerm.toLowerCase());
    
    return tabFilter && searchFilter;
  });

  // Count unread messages
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inbox</h1>
          <p className="text-gray-400">
            View your notifications and messages from buyers and sellers.
          </p>
        </div>
        
        <Card className="art-card">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Message List */}
            <div className="lg:col-span-1">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CardTitle className="text-lg font-semibold">Messages</CardTitle>
                    {unreadCount > 0 && (
                      <Badge variant="default" className="ml-2 bg-art-purple">
                        {unreadCount} unread
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="art-input pl-9"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-art-charcoal mx-4 w-[calc(100%-2rem)]">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                  <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
                  <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
                </TabsList>
                
                <ScrollArea className="h-[500px] mt-2">
                  {filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                      <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium mb-1">No messages found</h3>
                      <p className="text-gray-400 text-sm">
                        {searchTerm ? "Try a different search term" : "Your inbox is empty"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {filteredMessages.map((message) => (
                        <React.Fragment key={message.id}>
                          <div 
                            className={`p-4 cursor-pointer hover:bg-art-charcoal transition-colors ${
                              selectedMessage?.id === message.id ? 'bg-art-charcoal' : ''
                            } ${!message.read ? 'bg-art-purple/5' : ''}`}
                            onClick={() => handleMessageClick(message)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                {message.type === "message" ? (
                                  <Avatar>
                                    <AvatarImage src={message.avatar} alt={message.sender} />
                                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-art-purple/20 flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-art-purple" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className={`font-medium truncate ${!message.read ? 'text-white' : 'text-gray-300'}`}>
                                    {message.title}
                                  </h4>
                                  {!message.read && <div className="h-2 w-2 rounded-full bg-art-purple flex-shrink-0 mt-2"></div>}
                                </div>
                                
                                <p className="text-sm text-gray-400 truncate mb-1">
                                  {message.content.substring(0, 60)}...
                                </p>
                                
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500">{formatTimestamp(message.timestamp)}</span>
                                  <span className="text-art-purple">{message.relatedItem}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Separator className="mx-4 w-[calc(100%-2rem)]" />
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </Tabs>
            </div>
            
            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="h-full flex flex-col">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold mb-1">
                          {selectedMessage.title}
                        </CardTitle>
                        <p className="text-art-purple text-sm">
                          Related to: {selectedMessage.relatedItem}
                        </p>
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatTimestamp(selectedMessage.timestamp)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="mb-4 flex items-start gap-3">
                      {selectedMessage.type === "message" ? (
                        <Avatar>
                          <AvatarImage src={selectedMessage.avatar} alt={selectedMessage.sender} />
                          <AvatarFallback>{selectedMessage.sender[0]}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-art-purple/20 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-art-purple" />
                        </div>
                      )}
                      
                      <div>
                        <div className="font-medium mb-1">
                          {selectedMessage.type === "message" ? selectedMessage.sender : "ART Auction"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {selectedMessage.type === "message" ? selectedMessage.email : "System Notification"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-art-charcoal p-4 rounded-lg mb-6 text-gray-200">
                      {selectedMessage.content}
                    </div>
                    
                    {selectedMessage.instructionType === "buyer" && (
                      <div className="bg-art-purple/20 border border-art-purple/30 p-4 rounded-lg mb-6">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-art-purple flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-white mb-1">Next Steps:</h4>
                            <p className="text-sm text-gray-200">
                              Please contact the seller at <span className="text-art-purple">{selectedMessage.email}</span> to arrange payment and delivery details.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedMessage.instructionType === "seller" && (
                      <div className="bg-art-purple/20 border border-art-purple/30 p-4 rounded-lg mb-6">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-5 w-5 text-art-purple flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-white mb-1">Payment Reminder:</h4>
                            <p className="text-sm text-gray-200">
                              Please contact the buyer at <span className="text-art-purple">{selectedMessage.email}</span> to arrange payment. 
                              Remember to request 25% of the final price as per platform policy.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-auto">
                      {selectedMessage.type === "message" && (
                        <Button 
                          onClick={() => setIsDialogOpen(true)}
                          className="bg-art-purple hover:bg-art-purple-dark text-white"
                        >
                          Reply to {selectedMessage.sender}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <MessageSquare className="h-16 w-16 text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No message selected</h3>
                  <p className="text-gray-400 max-w-md">
                    Select a message from the list to view its contents here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Reply Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-art-purple/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.sender}</DialogTitle>
            <DialogDescription>
              Your message will be sent directly to the user's email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-art-charcoal p-3 rounded-md text-sm text-gray-400">
              <strong className="text-gray-300">Re: {selectedMessage?.title}</strong>
              <p className="mt-1">
                {selectedMessage?.content.substring(0, 100)}...
              </p>
            </div>
            
            <div>
              <Input
                className="art-input mb-2"
                placeholder="Subject"
                defaultValue={`Re: ${selectedMessage?.title}`}
              />
              <textarea
                className="w-full h-32 bg-card border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-art-purple/50"
                placeholder="Write your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-art-purple/50 text-art-purple hover:bg-art-purple/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendReply}
              className="bg-art-purple hover:bg-art-purple-dark text-white"
              disabled={!replyText.trim()}
            >
              <Send className="h-4 w-4 mr-2" /> Send Reply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Inbox;
