package com.socialmedia.dto;

import jakarta.validation.constraints.Size;

public class CreatePostRequest {

    /*
     * Text optional hai.
     * Photo-only post bhi allowed hai.
     */
    @Size(
        max = 5000,
        message = "Content cannot exceed 5000 characters"
    )
    private String content;

    private Long userId;

    private Long mediaId;

    /*
     * Public / Followers / Only me
     */
    private String privacy;

    /*
     * Optional
     */
    private String feeling;

    /*
     * Optional
     */
    private String location;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public CreatePostRequest() {
    }


    // ==========================================
    // GETTERS / SETTERS
    // ==========================================

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public Long getMediaId() {
        return mediaId;
    }

    public void setMediaId(Long mediaId) {
        this.mediaId = mediaId;
    }


    public String getPrivacy() {
        return privacy;
    }

    public void setPrivacy(String privacy) {
        this.privacy = privacy;
    }


    public String getFeeling() {
        return feeling;
    }

    public void setFeeling(String feeling) {
        this.feeling = feeling;
    }


    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}