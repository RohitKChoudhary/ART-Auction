
package com.art.auction.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "auctions")
public class Auction {
    
    @Id
    private String id;
    
    private String name;
    
    private String description;
    
    private String sellerId;
    
    private String sellerName;
    
    private double minBid;
    
    private double currentBid;
    
    private String currentBidderId;
    
    private String currentBidderName;
    
    private String imageUrl;
    
    private List<Bid> bids = new ArrayList<>();
    
    private AuctionStatus status = AuctionStatus.ACTIVE;
    
    private LocalDateTime endTime;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Enum for auction status
    public enum AuctionStatus {
        ACTIVE,
        ENDED,
        CANCELLED
    }
}
