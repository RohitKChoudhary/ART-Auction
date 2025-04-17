
package com.art.auction.controller;

import com.art.auction.dto.AuctionRequest;
import com.art.auction.model.Auction;
import com.art.auction.model.User;
import com.art.auction.repository.AuctionRepository;
import com.art.auction.repository.UserRepository;
import com.art.auction.security.UserDetailsImpl;
import com.art.auction.service.AuctionService;
import com.art.auction.service.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auctions")
public class AuctionController {
    
    @Autowired
    private AuctionService auctionService;
    
    @Autowired
    private AuctionRepository auctionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<Auction>> getAllActiveAuctions() {
        List<Auction> auctions = auctionService.findAllActiveAuctions();
        return ResponseEntity.ok(auctions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAuctionById(@PathVariable String id) {
        Optional<Auction> auction = auctionRepository.findById(id);
        
        if (auction.isPresent()) {
            return ResponseEntity.ok(auction.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/seller")
    public ResponseEntity<List<Auction>> getSellerAuctions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Auction> auctions = auctionRepository.findBySellerId(userDetails.getId());
        return ResponseEntity.ok(auctions);
    }

    @PostMapping
    public ResponseEntity<?> createAuction(
            @Valid @RequestPart("auction") AuctionRequest auctionRequest,
            @RequestPart("image") MultipartFile imageFile,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        try {
            // Upload the image first
            String imageUrl = fileStorageService.storeFile(imageFile);
            
            // Get the seller info
            Optional<User> seller = userRepository.findById(userDetails.getId());
            if (seller.isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Seller not found");
            }

            // Create and save the auction
            Auction auction = new Auction();
            auction.setName(auctionRequest.getName());
            auction.setDescription(auctionRequest.getDescription());
            auction.setSellerId(userDetails.getId());
            auction.setSellerName(seller.get().getName());
            auction.setMinBid(auctionRequest.getMinBid());
            auction.setCurrentBid(auctionRequest.getMinBid());
            auction.setImageUrl(imageUrl);
            auction.setStatus(Auction.AuctionStatus.ACTIVE);
            
            // Calculate end time based on duration
            auction.setEndTime(LocalDateTime.now().plusHours(auctionRequest.getDurationHours()));
            auction.setCreatedAt(LocalDateTime.now());
            auction.setUpdatedAt(LocalDateTime.now());
            
            Auction savedAuction = auctionRepository.save(auction);
            
            return ResponseEntity.ok(savedAuction);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> cancelAuction(@PathVariable String id) {
        Optional<Auction> auctionData = auctionRepository.findById(id);
        
        if (auctionData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Auction auction = auctionData.get();
        auction.setStatus(Auction.AuctionStatus.CANCELLED);
        auction.setUpdatedAt(LocalDateTime.now());
        
        auctionRepository.save(auction);
        return ResponseEntity.ok("Auction cancelled successfully");
    }
}
