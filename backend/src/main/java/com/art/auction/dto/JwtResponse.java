
package com.art.auction.dto;

import com.art.auction.model.User;
import lombok.Data;

import java.util.Set;

@Data
public class JwtResponse {
    
    private String token;
    private String id;
    private String name;
    private String email;
    private Set<User.Role> roles;
    
    public JwtResponse(String token, String id, String name, String email, Set<User.Role> roles) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
    }
}
