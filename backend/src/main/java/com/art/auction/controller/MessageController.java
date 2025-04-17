
package com.art.auction.controller;

import com.art.auction.model.Message;
import com.art.auction.repository.MessageRepository;
import com.art.auction.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping
    public ResponseEntity<List<Message>> getUserMessages(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Message> messages = messageRepository.findByRecipientIdOrderByTimestampDesc(userDetails.getId());
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Message>> getUnreadMessages(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Message> unreadMessages = messageRepository.findByRecipientIdAndReadFalse(userDetails.getId());
        return ResponseEntity.ok(unreadMessages);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Optional<Message> messageData = messageRepository.findById(id);
        
        if (messageData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Message message = messageData.get();
        
        // Ensure the user can only mark their own messages as read
        if (!message.getRecipientId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body("Error: You can only mark your own messages as read");
        }
        
        message.setRead(true);
        messageRepository.save(message);
        
        return ResponseEntity.ok("Message marked as read");
    }

    @PostMapping
    public ResponseEntity<?> createMessage(
            @RequestBody Map<String, String> messageData,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        try {
            Message message = new Message();
            message.setSenderId(userDetails.getId());
            message.setRecipientId(messageData.get("recipientId"));
            message.setContent(messageData.get("content"));
            message.setType(Message.MessageType.valueOf(messageData.getOrDefault("type", "SYSTEM_NOTIFICATION")));
            message.setTimestamp(LocalDateTime.now());
            
            if (messageData.containsKey("auctionId")) {
                message.setAuctionId(messageData.get("auctionId"));
            }
            
            Message savedMessage = messageRepository.save(message);
            return ResponseEntity.ok(savedMessage);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
