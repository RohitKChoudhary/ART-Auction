
package com.art.auction.repository;

import com.art.auction.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    
    List<Message> findByRecipientIdOrderByTimestampDesc(String recipientId);
    
    List<Message> findByRecipientIdAndReadFalse(String recipientId);
}
