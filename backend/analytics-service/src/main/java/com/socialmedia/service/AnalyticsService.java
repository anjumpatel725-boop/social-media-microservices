package com.socialmedia.service;

import com.socialmedia.dto.AnalyticsResponse;
import com.socialmedia.entity.AnalyticsEvent;
import com.socialmedia.repository.AnalyticsEventRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnalyticsService {

    private final AnalyticsEventRepository repository;

    public AnalyticsService(
            AnalyticsEventRepository repository) {

        this.repository = repository;
    }

    public AnalyticsEvent trackEvent(
            Long userId,
            String eventType,
            String description) {

        AnalyticsEvent event = new AnalyticsEvent();

        event.setUserId(userId);
        event.setEventType(eventType);
        event.setDescription(description);
        event.setCreatedAt(LocalDateTime.now());

        return repository.save(event);
    }

    public AnalyticsResponse getSummary() {

        long totalEvents = repository.count();

        long posts =
                repository.countByEventType("POST_CREATED");

        long likes =
                repository.countByEventType("LIKE");

        long comments =
                repository.countByEventType("COMMENT");

        long messages =
                repository.countByEventType("MESSAGE_SENT");

        long mediaUploads =
                repository.countByEventType("MEDIA_UPLOADED");

        long notifications =
                repository.countByEventType("NOTIFICATION");

        return new AnalyticsResponse(
                totalEvents,
                posts,
                likes,
                comments,
                messages,
                mediaUploads,
                notifications
        );
    }

    public List<AnalyticsEvent> getUserAnalytics(
            Long userId) {

        return repository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }
}