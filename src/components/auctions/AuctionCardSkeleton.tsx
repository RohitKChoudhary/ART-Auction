
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AuctionCardSkeleton: React.FC = () => {
  return (
    <Card className="art-card p-4">
      <div className="aspect-square bg-art-charcoal rounded-md overflow-hidden mb-4">
        <Skeleton className="w-full h-full" />
      </div>
      <Skeleton className="h-6 w-2/3 mb-2" />
      <div className="flex justify-between text-sm mb-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="flex justify-between text-sm">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </Card>
  );
};

export default AuctionCardSkeleton;
