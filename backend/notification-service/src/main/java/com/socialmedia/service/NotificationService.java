package com.socialmedia.service;


import com.socialmedia.dto.NotificationResponse;
import com.socialmedia.entity.Notification;
import com.socialmedia.repository.NotificationRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {

        this.notificationRepository =
                notificationRepository;
    }


    // =====================================================
    // CREATE
    // =====================================================

    public NotificationResponse createNotification(
            Long userId,
            Long senderId,
            String type,
            String message) {

        Notification notification =
                new Notification();

        notification.setUserId(userId);
        notification.setSenderId(senderId);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(
                LocalDateTime.now()
        );

        Notification saved =
                notificationRepository.save(
                        notification
                );

        return convertToResponse(saved);
    }


    // =====================================================
    // GET ALL
    // =====================================================

    public List<NotificationResponse>
    getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =====================================================
    // GET UNREAD
    // =====================================================

    public List<NotificationResponse>
    getUnreadNotifications(Long userId) {

        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(
                        userId
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =====================================================
    // MARK READ
    // =====================================================

    public NotificationResponse markAsRead(Long id) {

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found with id: "
                                                + id
                                )
                        );

        notification.setRead(true);

        Notification updated =
                notificationRepository.save(
                        notification
                );

        return convertToResponse(updated);
    }


    // =====================================================
    // DELETE
    // =====================================================

    public void deleteNotification(Long id) {

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found with id: "
                                                + id
                                )
                        );

        notificationRepository.delete(
                notification
        );
    }


    // =====================================================
    // CONVERT
    // =====================================================

    private NotificationResponse convertToResponse(
            Notification notification) {

        return new NotificationResponse(

                notification.getId(),

                notification.getUserId(),

                notification.getSenderId(),

                notification.getType(),

                notification.getMessage(),

                notification.isRead(),

                notification.getCreatedAt()
        );
    }
}