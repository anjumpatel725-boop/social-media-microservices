package com.socialmedia.service;

import com.socialmedia.dto.CreatePostRequest;
import com.socialmedia.dto.PostResponse;
import com.socialmedia.entity.Post;
import com.socialmedia.repository.PostRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;


    public PostService(
            PostRepository postRepository) {

        this.postRepository =
                postRepository;
    }


    // ==========================================
    // CREATE POST
    // ==========================================

    public PostResponse createPost(
            CreatePostRequest request) {

        if (request.getUserId() == null) {

            throw new RuntimeException(
                    "User ID is required"
            );
        }


        /*
         * Text null ho to empty string
         */
        String content =
                request.getContent();

        if (content == null) {
            content = "";
        }


        /*
         * Text aur image dono empty hain
         * to post allow nahi karna
         */
        boolean hasText =
                !content.trim().isEmpty();

        boolean hasMedia =
                request.getMediaId() != null;


        if (!hasText && !hasMedia) {

            throw new RuntimeException(
                    "Post must contain text or photo"
            );
        }


        Post post =
                new Post();


        // User
        post.setUserId(
                request.getUserId()
        );


        // Content
        post.setContent(
                content.trim()
        );


        // Media
        post.setMediaId(
                request.getMediaId()
        );


        // Privacy
        if (request.getPrivacy() == null ||
                request.getPrivacy().isBlank()) {

            post.setPrivacy("Public");

        } else {

            post.setPrivacy(
                    request.getPrivacy()
            );
        }


        // Feeling
        post.setFeeling(
                request.getFeeling()
        );


        // Location
        post.setLocation(
                request.getLocation()
        );


        // Save
        Post savedPost =
                postRepository.save(post);


        return new PostResponse(
                savedPost
        );
    }


    // ==========================================
    // GET ALL POSTS
    // ==========================================

    public List<PostResponse> getAllPosts() {

        return postRepository
                .findAll()
                .stream()
                .map(PostResponse::new)
                .toList();
    }


    // ==========================================
    // GET POST BY ID
    // ==========================================

    public PostResponse getPostById(
            Long id) {

        Post post =
                postRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Post not found"
                                )
                        );

        return new PostResponse(post);
    }


    // ==========================================
    // GET POSTS BY USER
    // ==========================================

    public List<PostResponse> getPostsByUser(
            Long userId) {

        return postRepository
                .findByUserId(userId)
                .stream()
                .map(PostResponse::new)
                .toList();
    }


    // ==========================================
    // UPDATE POST
    // ==========================================

    public PostResponse updatePost(
            Long id,
            CreatePostRequest request) {

        Post post =
                postRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Post not found"
                                )
                        );


        String content =
                request.getContent();

        if (content == null) {
            content = "";
        }


        boolean hasText =
                !content.trim().isEmpty();

        boolean hasMedia =
                request.getMediaId() != null ||
                post.getMediaId() != null;


        if (!hasText && !hasMedia) {

            throw new RuntimeException(
                    "Post must contain text or photo"
            );
        }


        post.setContent(
                content.trim()
        );


        if (request.getMediaId() != null) {

            post.setMediaId(
                    request.getMediaId()
            );
        }


        if (request.getPrivacy() != null &&
                !request.getPrivacy().isBlank()) {

            post.setPrivacy(
                    request.getPrivacy()
            );
        }


        post.setFeeling(
                request.getFeeling()
        );


        post.setLocation(
                request.getLocation()
        );


        Post updatedPost =
                postRepository.save(post);


        return new PostResponse(
                updatedPost
        );
    }


    // ==========================================
    // DELETE POST
    // ==========================================

    public void deletePost(
            Long id) {

        if (!postRepository.existsById(id)) {

            throw new RuntimeException(
                    "Post not found"
            );
        }


        postRepository.deleteById(id);
    }
}