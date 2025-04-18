
package com.art.auction.controller;

import com.art.auction.dto.AuthRequest;
import com.art.auction.dto.JwtResponse;
import com.art.auction.dto.SignupRequest;
import com.art.auction.model.User;
import com.art.auction.repository.UserRepository;
import com.art.auction.security.JwtUtils;
import com.art.auction.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getName(),
                    userDetails.getEmail(),
                    new HashSet<>(userDetails.getAuthorities().stream()
                            .map(item -> User.Role.valueOf(item.getAuthority()))
                            .toList())
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid credentials: Email or password is incorrect");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Authentication error: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email is already in use!");
            }

            // Validate inputs
            if (signUpRequest.getName() == null || signUpRequest.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Name is required.");
            }
            
            if (signUpRequest.getPassword() == null || signUpRequest.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body("Error: Password must be at least 6 characters.");
            }

            // Create new user's account
            User user = new User();
            user.setName(signUpRequest.getName());
            user.setEmail(signUpRequest.getEmail());
            user.setPassword(encoder.encode(signUpRequest.getPassword()));

            Set<User.Role> roles = new HashSet<>();
            // Default role is USER
            roles.add(User.Role.ROLE_USER);
            
            // For admin credentials
            if ("art123bets@gmail.com".equals(signUpRequest.getEmail())) {
                roles.add(User.Role.ROLE_ADMIN);
            }
            
            user.setRoles(roles);
            user.setActive(true);
            user.setCreatedAt(LocalDateTime.now().toString());
            user.setUpdatedAt(LocalDateTime.now().toString());
            
            userRepository.save(user);

            // After successful registration, auto-login the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(signUpRequest.getEmail(), signUpRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getName(),
                    userDetails.getEmail(),
                    userDetails.getAuthorities().stream()
                            .map(item -> User.Role.valueOf(item.getAuthority()))
                            .collect(java.util.stream.Collectors.toSet())
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Registration failed. " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            // In a real app, this would send an email with a reset link
            // For now, we'll just check if the user exists
            if (!userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body("Error: Email not found!");
            }

            return ResponseEntity.ok("Password reset instructions sent to your email.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Password reset failed. " + e.getMessage());
        }
    }
}
