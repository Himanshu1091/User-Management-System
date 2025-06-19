package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.UserService;
import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> testApi() {
        return ResponseEntity.ok("User API is working!");
    }

    // Register user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // If no role set on register, default to USER
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("USER");
            }
            User savedUser = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthRequest authRequest) {
        try {
            User user = userService.authenticateUser(authRequest);
            AuthResponse response = new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // Get all users - only admin can access
    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestParam String requesterEmail) {
        User requester = userService.getUserByEmail(requesterEmail);
        if (requester == null || !"ADMIN".equalsIgnoreCase(requester.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Get user profile (any user can get own profile)
    @GetMapping("/profile/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(user);
    }

    // Update user - only admin can update any user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
            @RequestBody User user,
            @RequestParam String requesterEmail) {
        User requester = userService.getUserByEmail(requesterEmail);
        if (requester == null || !"ADMIN".equalsIgnoreCase(requester.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(user.getPassword()); // For now plain text
        }
        if (user.getRole() != null && !user.getRole().isEmpty()) {
            existingUser.setRole(user.getRole());
        }

        User updatedUser = userService.updateUser(existingUser);
        return ResponseEntity.ok(updatedUser);
    }

    // Delete user - only admin
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id,
            @RequestParam String requesterEmail) {
        User requester = userService.getUserByEmail(requesterEmail);
        if (requester == null || !"ADMIN".equalsIgnoreCase(requester.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        boolean deleted = userService.deleteUser(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok("User deleted successfully");
    }
}
