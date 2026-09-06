package com.socialmedia.user.controller;

import com.socialmedia.user.dto.AuthResponse;
import com.socialmedia.user.dto.LoginRequest;
import com.socialmedia.user.dto.RegisterRequest;
import com.socialmedia.user.entity.User;
import com.socialmedia.user.service.UserService;
import com.socialmedia.user.dto.UserResponse;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                userService.login(request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUser(id)
        );
    }

    @GetMapping
public ResponseEntity<java.util.List<UserResponse>> getAllUsers() {

    return ResponseEntity.ok(
            userService.getAllUsers()
    );
}
@PostMapping("/{followingId}/follow")
public ResponseEntity<String> followUser(
        @PathVariable Long followingId,
        @RequestParam Long followerId) {

    userService.followUser(
            followerId,
            followingId
    );

    return ResponseEntity.ok(
            "User followed successfully"
    );
}
@DeleteMapping("/{followingId}/follow")
public ResponseEntity<String> unfollowUser(
        @PathVariable Long followingId,
        @RequestParam Long followerId) {

    userService.unfollowUser(
            followerId,
            followingId
    );

    return ResponseEntity.ok(
            "User unfollowed successfully"
    );
}
@GetMapping("/{followingId}/following")
public ResponseEntity<Boolean> isFollowing(
        @PathVariable Long followingId,
        @RequestParam Long followerId) {

    return ResponseEntity.ok(
            userService.isFollowing(
                    followerId,
                    followingId
            )
    );
}
}