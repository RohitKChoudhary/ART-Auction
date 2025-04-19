
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateAuctionForm from "@/components/seller/CreateAuctionForm";
import AuctionsList from "@/components/seller/AuctionsList";

const Seller = () => {
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
            <CreateAuctionForm />
          </TabsContent>

          <TabsContent value="my-auctions" className="mt-6">
            <AuctionsList />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Seller;
