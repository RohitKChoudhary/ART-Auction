
package com.art.auction.dto;

import lombok.Data;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Data
public class BidRequest {
    
    @NotNull(message = "Auction ID is required")
    private String auctionId;
    
    @NotNull(message = "Bid amount is required")
    @Min(value = 1, message = "Bid amount must be at least 1")
    private Double amount;
}
