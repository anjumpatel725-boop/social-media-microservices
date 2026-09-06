package com.socialmedia.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    /*
     * Text content optional hai.
     * Photo-only post bhi allow karna hai.
     */
    @Column(length = 5000)
    private String content;

    /*
     * Media Service se aane wali media ID
     */
    private Long mediaId;

    /*
     * Public / Followers / Only me
     */
    @Column(nullable = false)
    private String privacy = "Public";

    /*
     * Optional feeling
     */
    @Column(length = 100)
    private String feeling;

    /*
     * Optional location
     */
    @Column(length = 255)
    private String location;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;


    // ==========================================
    // CONSTRUCTORS
    // ==========================================

    public Post() {
    }


    public Post(Long userId, String content) {

        this.userId = userId;

        this.content =
                content == null ? "" : content;

        this.privacy = "Public";

        this.createdAt =
                LocalDateTime.now();

        this.updatedAt =
                LocalDateTime.now();
    }


    // ==========================================
    // PRE PERSIST
    // ==========================================

    @PrePersist
    public void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }

        if (privacy == null ||
                privacy.isBlank()) {

            privacy = "Public";
        }

        if (content == null) {
            content = "";
        }
    }


    // ==========================================
    // PRE UPDATE
    // ==========================================

    @PreUpdate
    public void onUpdate() {

        updatedAt =
                LocalDateTime.now();

        if (content == null) {
            content = "";
        }
    }


    // ==========================================
    // GETTERS / SETTERS
    // ==========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public String getContent() {
        return content;
    }

    public void setContent(String content) {

        this.content =
                content == null ? "" : content;
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

        this.privacy =
                privacy == null ||
                privacy.isBlank()
                        ? "Public"
                        : privacy;
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


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt) {

        this.updatedAt = updatedAt;
    }
}