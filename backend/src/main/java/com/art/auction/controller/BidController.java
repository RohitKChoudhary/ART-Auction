
package com.art.auction.controller;

import com.art.auction.dto.BidRequest;
import com.art.auction.model.Auction;
import com.art.auction.model.Bid;
import com.art.auction.model.User;
import com.art.auction.repository.AuctionRepository;
import com.art.auction.repository.BidRepository;
import com.art.auction.repository.UserRepository;
import com.art.auction.security.UserDetailsImpl;
import com.art.auction.service.WebSocketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bids")
public class BidController {

    @Autowired
    private BidRepository bidRepository;
    
    @Autowired
    private AuctionRepository auctionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WebSocketService webSocketService;

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<Bid>> getBidsByAuction(@PathVariable String auctionId) {
        List<Bid> bids = bidRepository.findByAuctionId(auctionId);
        return ResponseEntity.ok(bids);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Bid>> getUserBids(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Bid> bids = bidRepository.findByBidderId(userDetails.getId());
        return ResponseEntity.ok(bids);
    }

    @PostMapping
    public ResponseEntity<?> placeBid(
            @Valid @RequestBody BidRequest bidRequest,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        // Find the auction
        Optional<Auction> auctionData = auctionRepository.findById(bidRequest.getAuctionId());
        if (auctionData.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Auction not found");
        }
        
        Auction auction = auctionData.get();
        
        // Check if auction is active
        if (auction.getStatus() != Auction.AuctionStatus.ACTIVE) {
            return ResponseEntity.badRequest().body("Error: This auction is not active");
        }
        
        // Check if auction has ended
        if (auction.getEndTime().isBefore(LocalDateTime.now())) {
            auction.setStatus(Auction.AuctionStatus.ENDED);
            auctionRepository.save(auction);
            return ResponseEntity.badRequest().body("Error: This auction has ended");
        }
        
        // Check if bid is high enough
        if (bidRequest.getAmount() <= auction.getCurrentBid()) {
            return ResponseEntity.badRequest().body("Error: Bid amount must be higher than current bid");
        }
        
        // Get bidder info
        Optional<User> bidder = userRepository.findById(userDetails.getId());
        if (bidder.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Bidder not found");
        }
        
        // Prevent seller from bidding on their own item
        if (auction.getSellerId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body("Error: You cannot bid on your own item");
        }
        
        try {
            // Create and save bid
            Bid bid = new Bid();
            bid.setAuctionId(auction.getId());
            bid.setBidderId(userDetails.getId());
            bid.setBidderName(bidder.get().getName());
            bid.setAmount(bidRequest.getAmount());
            bid.setTimestamp(LocalDateTime.now());
            
            Bid savedBid = bidRepository.save(bid);
            
            // Update auction with new bid
            auction.setCurrentBid(bidRequest.getAmount());
            auction.setCurrentBidderId(userDetails.getId());
            auction.setCurrentBidderName(bidder.get().getName());
            auction.getBids().add(savedBid);
            auction.setUpdatedAt(LocalDateTime.now());
            
            auctionRepository.save(auction);
            
            // Notify clients about the new bid via WebSocket
            webSocketService.notifyBidPlaced(auction);
            
            return ResponseEntity.ok(savedBid);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
