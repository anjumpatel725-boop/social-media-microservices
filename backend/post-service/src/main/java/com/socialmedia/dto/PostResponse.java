package com.socialmedia.dto;

import com.socialmedia.entity.Post;

import java.time.LocalDateTime;

public class PostResponse {

    private Long id;

    private Long userId;

    private String content;

    private Long mediaId;

    private String privacy;

    private String feeling;

    private String location;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public PostResponse() {
    }


    public PostResponse(Post post) {

        this.id =
                post.getId();

        this.userId =
                post.getUserId();

        this.content =
                post.getContent();

        this.mediaId =
                post.getMediaId();

        this.privacy =
                post.getPrivacy();

        this.feeling =
                post.getFeeling();

        this.location =
                post.getLocation();

        this.createdAt =
                post.getCreatedAt();

        this.updatedAt =
                post.getUpdatedAt();
    }


    // ==========================================
    // GETTERS
    // ==========================================

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getContent() {
        return content;
    }

    public Long getMediaId() {
        return mediaId;
    }

    public String getPrivacy() {
        return privacy;
    }

    public String getFeeling() {
        return feeling;
    }

    public String getLocation() {
        return location;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}