package com.socialmedia.service;

import com.socialmedia.dto.MediaResponse;
import com.socialmedia.entity.Media;
import com.socialmedia.repository.MediaRepository;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;


    private final Path uploadDirectory =
            Paths.get("uploads");


    public MediaService(
            MediaRepository mediaRepository) {

        this.mediaRepository =
                mediaRepository;


        try {

            Files.createDirectories(
                    uploadDirectory
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not create upload directory",
                    e
            );
        }
    }


    // ==========================================
    // UPLOAD MEDIA
    // ==========================================

    public MediaResponse uploadMedia(
            MultipartFile file,
            Long userId)
            throws IOException {

        if (file == null ||
                file.isEmpty()) {

            throw new IllegalArgumentException(
                    "File cannot be empty"
            );
        }


        if (userId == null) {

            throw new IllegalArgumentException(
                    "User ID is required"
            );
        }


        String originalFileName =
                file.getOriginalFilename();


        String extension = "";


        if (originalFileName != null &&
                originalFileName.contains(".")) {

            extension =
                    originalFileName.substring(
                            originalFileName
                                    .lastIndexOf(".")
                    );
        }


        String storedFileName =
                UUID.randomUUID()
                        + extension;


        Path targetPath =
                uploadDirectory.resolve(
                        storedFileName
                );


        Files.copy(
                file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING
        );


        Media media =
                new Media();


        media.setUserId(userId);

        media.setOriginalFileName(
                originalFileName
        );

        media.setStoredFileName(
                storedFileName
        );

        media.setFileType(
                file.getContentType()
        );

        media.setFileSize(
                file.getSize()
        );

        media.setFilePath(
                targetPath.toAbsolutePath()
                        .toString()
        );

        media.setUploadedAt(
                LocalDateTime.now()
        );


        Media savedMedia =
                mediaRepository.save(media);


        return convertToResponse(
                savedMedia
        );
    }


    // ==========================================
    // GET MEDIA ENTITY
    // ==========================================

    public Media getMediaEntity(
            Long id) {

        return mediaRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Media not found with id: "
                                        + id
                        )
                );
    }


    // ==========================================
    // GET MEDIA RESOURCE
    // ==========================================

    public Resource getMediaResource(
            Media media)
            throws IOException {

        Path path =
                Paths.get(
                        media.getFilePath()
                );


        Resource resource =
                new UrlResource(
                        path.toUri()
                );


        if (!resource.exists() ||
                !resource.isReadable()) {

            throw new RuntimeException(
                    "Media file not found: "
                            + media.getFilePath()
            );
        }


        return resource;
    }


    // ==========================================
    // GET MEDIA DETAILS
    // ==========================================

    public MediaResponse getMedia(
            Long id) {

        Media media =
                getMediaEntity(id);

        return convertToResponse(
                media
        );
    }


    // ==========================================
    // GET USER MEDIA
    // ==========================================

    public List<MediaResponse> getUserMedia(
            Long userId) {

        return mediaRepository
                .findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // ==========================================
    // DELETE
    // ==========================================

    public void deleteMedia(
            Long id)
            throws IOException {

        Media media =
                getMediaEntity(id);


        try {

            Path filePath =
                    Paths.get(
                            media.getFilePath()
                    );

            Files.deleteIfExists(
                    filePath
            );

        } catch (IOException e) {

            System.out.println(
                    "File deletion failed: "
                            + e.getMessage()
            );
        }


        mediaRepository.delete(media);
    }


    // ==========================================
    // CONVERT
    // ==========================================

    private MediaResponse convertToResponse(
            Media media) {

        return new MediaResponse(

                media.getId(),

                media.getUserId(),

                media.getOriginalFileName(),

                media.getFileType(),

                media.getFileSize(),

                media.getFilePath(),

                media.getUploadedAt()
        );
    }
}