package com.socialmedia.controller;

import com.socialmedia.dto.MediaResponse;
import com.socialmedia.entity.Media;
import com.socialmedia.service.MediaService;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/media")
public class MediaController {

    private final MediaService mediaService;


    public MediaController(
            MediaService mediaService) {

        this.mediaService =
                mediaService;
    }


    // ==========================================
    // UPLOAD
    // ==========================================

    @PostMapping("/upload")
    public ResponseEntity<MediaResponse> uploadMedia(

            @RequestParam("file")
            MultipartFile file,

            @RequestParam("userId")
            Long userId)

            throws IOException {

        MediaResponse response =
                mediaService.uploadMedia(
                        file,
                        userId
                );

        return ResponseEntity
                .status(201)
                .body(response);
    }


    // ==========================================
    // GET MEDIA DETAILS
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<MediaResponse> getMedia(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                mediaService.getMedia(id)
        );
    }


    // ==========================================
    // GET USER MEDIA
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MediaResponse>> getUserMedia(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                mediaService.getUserMedia(userId)
        );
    }


    // ==========================================
    // SERVE ACTUAL FILE
    // ==========================================

    @GetMapping("/file/{id}")
    public ResponseEntity<Resource> getMediaFile(
            @PathVariable Long id)
            throws IOException {

        Media media =
                mediaService.getMediaEntity(id);


        Resource resource =
                mediaService.getMediaResource(media);


        String contentType =
                media.getFileType();


        if (contentType == null ||
                contentType.isBlank()) {

            contentType =
                    "application/octet-stream";
        }


        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                contentType
                        )
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                media.getOriginalFileName() +
                                "\""
                )
                .body(resource);
    }


    // ==========================================
    // DELETE
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedia(
            @PathVariable Long id)
            throws IOException {

        mediaService.deleteMedia(id);

        return ResponseEntity.ok(
                "Media deleted successfully"
        );
    }
}