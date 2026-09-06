package com.socialmedia.dto;

public class AnalyticsResponse {

    private long totalEvents;
    private long posts;
    private long likes;
    private long comments;
    private long messages;
    private long mediaUploads;
    private long notifications;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(
            long totalEvents,
            long posts,
            long likes,
            long comments,
            long messages,
            long mediaUploads,
            long notifications) {

        this.totalEvents = totalEvents;
        this.posts = posts;
        this.likes = likes;
        this.comments = comments;
        this.messages = messages;
        this.mediaUploads = mediaUploads;
        this.notifications = notifications;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public long getPosts() {
        return posts;
    }

    public long getLikes() {
        return likes;
    }

    public long getComments() {
        return comments;
    }

    public long getMessages() {
        return messages;
    }

    public long getMediaUploads() {
        return mediaUploads;
    }

    public long getNotifications() {
        return notifications;
    }
}