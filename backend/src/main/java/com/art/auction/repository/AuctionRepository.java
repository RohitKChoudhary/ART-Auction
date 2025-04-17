
package com.art.auction.repository;

import com.art.auction.model.Auction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuctionRepository extends MongoRepository<Auction, String> {
    
    List<Auction> findBySellerId(String sellerId);
    
    List<Auction> findByStatus(Auction.AuctionStatus status);
    
    List<Auction> findByEndTimeBefore(LocalDateTime dateTime);
    
    List<Auction> findByEndTimeAfterAndStatus(LocalDateTime dateTime, Auction.AuctionStatus status);
}
