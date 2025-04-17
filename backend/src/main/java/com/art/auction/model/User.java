
package com.art.auction.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    private String name;
    
    private String email;
    
    private String password;
    
    private Set<Role> roles = new HashSet<>();
    
    private boolean active = true;
    
    private String createdAt;
    
    private String updatedAt;
    
    // Enum for user roles
    public enum Role {
        ROLE_USER,
        ROLE_ADMIN
    }
}
