package com.socialmedia.dto;

import java.time.LocalDateTime;

public class MediaResponse {

    private Long id;

    private Long userId;

    private String originalFileName;

    private String fileType;

    private Long fileSize;

    private String filePath;

    private LocalDateTime uploadedAt;


    public MediaResponse() {
    }


    public MediaResponse(
            Long id,
            Long userId,
            String originalFileName,
            String fileType,
            Long fileSize,
            String filePath,
            LocalDateTime uploadedAt) {

        this.id = id;

        this.userId = userId;

        this.originalFileName =
                originalFileName;

        this.fileType =
                fileType;

        this.fileSize =
                fileSize;

        this.filePath =
                filePath;

        this.uploadedAt =
                uploadedAt;
    }


    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public String getFileType() {
        return fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public String getFilePath() {
        return filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}