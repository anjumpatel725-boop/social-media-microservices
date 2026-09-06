package com.socialmedia.user.service;

import com.socialmedia.user.dto.AuthResponse;
import com.socialmedia.user.dto.LoginRequest;
import com.socialmedia.user.dto.RegisterRequest;
import com.socialmedia.user.dto.UserResponse;
import com.socialmedia.user.entity.User;
import com.socialmedia.user.repository.UserRepository;
import com.socialmedia.user.security.JwtService;
import com.socialmedia.user.dto.UserResponse;
import com.socialmedia.user.repository.FollowRepository;
import com.socialmedia.user.entity.Follow;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final FollowRepository followRepository;
    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        FollowRepository followRepository) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.followRepository = followRepository;
}

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        // Password is stored as BCrypt hash
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole("USER");

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser.getEmail());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail()
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(
                    () -> new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }

    public User getUser(Long id) {

        return userRepository.findById(id)
                .orElseThrow(
                    () -> new RuntimeException("User not found")
                );
    }
    public void followUser(
        Long followerId,
        Long followingId) {

    if (followerId.equals(followingId)) {
        throw new RuntimeException(
                "You cannot follow yourself"
        );
    }

    if (!userRepository.existsById(followerId)) {
        throw new RuntimeException(
                "Follower user not found"
        );
    }

    if (!userRepository.existsById(followingId)) {
        throw new RuntimeException(
                "User to follow not found"
        );
    }

    if (followRepository
            .existsByFollowerIdAndFollowingId(
                    followerId,
                    followingId)) {

        throw new RuntimeException(
                "Already following this user"
        );
    }

    Follow follow = new Follow(
            followerId,
            followingId
    );

    followRepository.save(follow);
}


public void unfollowUser(
        Long followerId,
        Long followingId) {

    Follow follow =
            followRepository
                .findByFollowerIdAndFollowingId(
                    followerId,
                    followingId
                )
                .orElseThrow(
                    () -> new RuntimeException(
                        "You are not following this user"
                    )
                );

    followRepository.delete(follow);
}


public boolean isFollowing(
        Long followerId,
        Long followingId) {

    return followRepository
            .existsByFollowerIdAndFollowingId(
                    followerId,
                    followingId
            );
}
 public java.util.List<UserResponse> getAllUsers() {

    return userRepository.findAll()
            .stream()
            .map(user -> new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail()
            ))
       
            .toList();
}
}