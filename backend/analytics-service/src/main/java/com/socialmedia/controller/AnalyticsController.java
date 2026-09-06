package com.socialmedia.controller;

import com.socialmedia.dto.AnalyticsResponse;
import com.socialmedia.entity.AnalyticsEvent;
import com.socialmedia.service.AnalyticsService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(
            AnalyticsService analyticsService) {

        this.analyticsService = analyticsService;
    }

    @PostMapping("/track")
    public ResponseEntity<AnalyticsEvent> trackEvent(
            @RequestParam Long userId,
            @RequestParam String eventType,
            @RequestParam(required = false) String description) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        analyticsService.trackEvent(
                                userId,
                                eventType,
                                description
                        )
                );
    }

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsResponse> getSummary() {

        return ResponseEntity.ok(
                analyticsService.getSummary()
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AnalyticsEvent>>
    getUserAnalytics(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                analyticsService.getUserAnalytics(userId)
        );
    }
}