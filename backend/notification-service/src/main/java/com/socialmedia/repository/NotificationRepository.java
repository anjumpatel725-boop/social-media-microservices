package com.socialmedia.repository;

import com.socialmedia.entity.Notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {


    // =====================================================
    // ALL NOTIFICATIONS
    // =====================================================

    List<Notification>
    findByUserIdOrderByCreatedAtDesc(
            Long userId
    );


    // =====================================================
    // UNREAD NOTIFICATIONS
    // =====================================================

    List<Notification>
    findByUserIdAndIsReadFalseOrderByCreatedAtDesc(
            Long userId
    );
    
}