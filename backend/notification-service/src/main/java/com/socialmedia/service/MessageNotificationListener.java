package com.socialmedia.service;

import com.socialmedia.dto.MessageNotificationEvent;
import com.socialmedia.service.NotificationService;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class MessageNotificationListener {

    private final NotificationService notificationService;

    public MessageNotificationListener(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    @RabbitListener(
            queues = "message-notification-queue"
    )
    public void handleMessageNotification(
            MessageNotificationEvent event) {

        System.out.println(
                "MESSAGE NOTIFICATION RECEIVED: "
                        + event.getMessage()
        );

        notificationService.createNotification(
                event.getReceiverId(),
                event.getSenderId(),
                "MESSAGE",
                "You received a new message: "
                        + event.getMessage()
        );
    }
}