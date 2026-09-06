package com.socialmedia.repository;

import com.socialmedia.entity.AnalyticsEvent;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnalyticsEventRepository
        extends JpaRepository<AnalyticsEvent, Long> {

    List<AnalyticsEvent> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByEventType(String eventType);

    long countByUserId(Long userId);
}