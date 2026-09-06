package com.socialmedia.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "media")
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String originalFileName;

    private String storedFileName;

    private String fileType;

    private Long fileSize;

    private String filePath;

    private LocalDateTime uploadedAt;


    public Media() {
    }


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


    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(
            String originalFileName) {

        this.originalFileName =
                originalFileName;
    }


    public String getStoredFileName() {
        return storedFileName;
    }

    public void setStoredFileName(
            String storedFileName) {

        this.storedFileName =
                storedFileName;
    }


    public String getFileType() {
        return fileType;
    }

    public void setFileType(
            String fileType) {

        this.fileType = fileType;
    }


    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(
            Long fileSize) {

        this.fileSize = fileSize;
    }


    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(
            String filePath) {

        this.filePath = filePath;
    }


    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(
            LocalDateTime uploadedAt) {

        this.uploadedAt = uploadedAt;
    }
}