
package com.art.auction.service;

import com.art.auction.model.Auction;
import com.art.auction.model.Message;
import com.art.auction.repository.AuctionRepository;
import com.art.auction.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuctionService {

    @Autowired
    private AuctionRepository auctionRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private WebSocketService webSocketService;

    public List<Auction> findAllActiveAuctions() {
        return auctionRepository.findByEndTimeAfterAndStatus(
                LocalDateTime.now(), Auction.AuctionStatus.ACTIVE);
    }

    // Scheduled task to check and end expired auctions
    @Scheduled(fixedRate = 60000) // Run every minute
    public void checkEndedAuctions() {
        List<Auction> endedAuctions = auctionRepository.findByEndTimeBefore(LocalDateTime.now());
        
        for (Auction auction : endedAuctions) {
            if (auction.getStatus() == Auction.AuctionStatus.ACTIVE) {
                endAuction(auction);
            }
        }
    }
    
    private void endAuction(Auction auction) {
        auction.setStatus(Auction.AuctionStatus.ENDED);
        auction.setUpdatedAt(LocalDateTime.now());
        auctionRepository.save(auction);
        
        // Notify users via WebSocket
        webSocketService.notifyAuctionEnded(auction);
        
        // Send notification messages if there was a winning bid
        if (auction.getCurrentBidderId() != null) {
            // Notify winner
            Message winnerMessage = new Message();
            winnerMessage.setSenderId("system");
            winnerMessage.setRecipientId(auction.getCurrentBidderId());
            winnerMessage.setAuctionId(auction.getId());
            winnerMessage.setContent("Congratulations! You've won the auction for " + auction.getName() + 
                    ". Please contact the seller at: " + auction.getSellerName());
            winnerMessage.setType(Message.MessageType.AUCTION_WON);
            winnerMessage.setTimestamp(LocalDateTime.now());
            messageRepository.save(winnerMessage);
            
            // Notify seller
            Message sellerMessage = new Message();
            sellerMessage.setSenderId("system");
            sellerMessage.setRecipientId(auction.getSellerId());
            sellerMessage.setAuctionId(auction.getId());
            sellerMessage.setContent("Your auction for " + auction.getName() + 
                    " has ended. The winning bidder is " + auction.getCurrentBidderName() + 
                    ". Please collect 25% of the final bid amount: $" + auction.getCurrentBid());
            sellerMessage.setType(Message.MessageType.AUCTION_SOLD);
            sellerMessage.setTimestamp(LocalDateTime.now());
            messageRepository.save(sellerMessage);
        }
    }
}
