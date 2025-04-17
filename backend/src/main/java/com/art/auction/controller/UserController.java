
package com.art.auction.controller;

import com.art.auction.model.User;
import com.art.auction.repository.UserRepository;
import com.art.auction.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Optional<User> user = userRepository.findById(userDetails.getId());
        
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.get().getId());
        response.put("name", user.get().getName());
        response.put("email", user.get().getEmail());
        response.put("roles", user.get().getRoles());
        response.put("active", user.get().isActive());
        response.put("createdAt", user.get().getCreatedAt());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        
        // Remove password from response
        users.forEach(user -> user.setPassword(null));
        
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String id) {
        Optional<User> userData = userRepository.findById(id);
        
        if (userData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userData.get();
        user.setActive(!user.isActive());
        user.setUpdatedAt(LocalDateTime.now().toString());
        
        userRepository.save(user);
        return ResponseEntity.ok("User status updated successfully");
    }

    @PutMapping("/{id}/promote")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> promoteToAdmin(@PathVariable String id) {
        Optional<User> userData = userRepository.findById(id);
        
        if (userData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userData.get();
        user.getRoles().add(User.Role.ROLE_ADMIN);
        user.setUpdatedAt(LocalDateTime.now().toString());
        
        userRepository.save(user);
        return ResponseEntity.ok("User promoted to admin successfully");
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, String> updates,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        Optional<User> userData = userRepository.findById(userDetails.getId());
        
        if (userData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userData.get();
        
        if (updates.containsKey("name")) {
            user.setName(updates.get("name"));
        }
        
        user.setUpdatedAt(LocalDateTime.now().toString());
        userRepository.save(user);
        
        return ResponseEntity.ok("Profile updated successfully");
    }
}
