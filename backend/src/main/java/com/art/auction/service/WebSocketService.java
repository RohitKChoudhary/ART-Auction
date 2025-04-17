
package com.art.auction.service;

import com.art.auction.model.Auction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyBidPlaced(Auction auction) {
        Map<String, Object> bidInfo = new HashMap<>();
        bidInfo.put("auctionId", auction.getId());
        bidInfo.put("auctionName", auction.getName());
        bidInfo.put("currentBid", auction.getCurrentBid());
        bidInfo.put("bidderName", auction.getCurrentBidderName());
        
        // Send to auction-specific topic
        messagingTemplate.convertAndSend("/topic/auction/" + auction.getId(), bidInfo);
        
        // Send to all active auctions topic
        messagingTemplate.convertAndSend("/topic/auctions", bidInfo);
    }

    public void notifyAuctionEnded(Auction auction) {
        Map<String, Object> auctionInfo = new HashMap<>();
        auctionInfo.put("auctionId", auction.getId());
        auctionInfo.put("auctionName", auction.getName());
        auctionInfo.put("status", auction.getStatus());
        auctionInfo.put("finalBid", auction.getCurrentBid());
        auctionInfo.put("winnerId", auction.getCurrentBidderId());
        auctionInfo.put("winnerName", auction.getCurrentBidderName());
        
        // Send to auction-specific topic
        messagingTemplate.convertAndSend("/topic/auction/" + auction.getId(), auctionInfo);
        
        // Send to all active auctions topic
        messagingTemplate.convertAndSend("/topic/auctions", auctionInfo);
        
        // Notify the specific users
        if (auction.getCurrentBidderId() != null) {
            messagingTemplate.convertAndSendToUser(
                    auction.getCurrentBidderId(), "/queue/notifications", 
                    "You won the auction for " + auction.getName());
        }
        
        messagingTemplate.convertAndSendToUser(
                auction.getSellerId(), "/queue/notifications", 
                "Your auction for " + auction.getName() + " has ended");
    }

    public void sendMessage(String userId, String message) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/messages", message);
    }
}
