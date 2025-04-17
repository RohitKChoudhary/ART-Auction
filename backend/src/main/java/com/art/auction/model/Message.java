
package com.art.auction.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "messages")
public class Message {
    
    @Id
    private String id;
    
    private String senderId;
    
    private String recipientId;
    
    private String content;
    
    private String auctionId;
    
    private boolean read = false;
    
    private MessageType type;
    
    private LocalDateTime timestamp;
    
    // Enum for message types
    public enum MessageType {
        AUCTION_WON,
        AUCTION_SOLD,
        SYSTEM_NOTIFICATION
    }
}
