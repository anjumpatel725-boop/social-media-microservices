package com.socialmedia.chat.service;

import com.socialmedia.chat.config.RabbitMQConfig;
import com.socialmedia.chat.dto.MessageRequest;
import com.socialmedia.chat.dto.MessageResponse;
import com.socialmedia.chat.entity.ChatMessage;
import com.socialmedia.chat.repository.ChatMessageRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import com.socialmedia.chat.event.MessageNotificationEvent;
import java.time.LocalDateTime;
import com.socialmedia.chat.config.RabbitMQConfig;
import com.socialmedia.chat.event.MessageNotificationEvent;
import java.util.List;

@Service
public class ChatService {

  private final ChatMessageRepository chatMessageRepository;
private final RabbitTemplate rabbitTemplate;

   public ChatService(
        ChatMessageRepository chatMessageRepository,
        RabbitTemplate rabbitTemplate) {

    this.chatMessageRepository = chatMessageRepository;
    this.rabbitTemplate = rabbitTemplate;
}

   public MessageResponse sendMessage(
        MessageRequest request) {

    ChatMessage chatMessage = new ChatMessage();

    chatMessage.setSenderId(request.getSenderId());
    chatMessage.setReceiverId(request.getReceiverId());
    chatMessage.setMessage(request.getMessage());
    chatMessage.setRead(false);
    chatMessage.setCreatedAt(LocalDateTime.now());

    ChatMessage saved =
            chatMessageRepository.save(chatMessage);


// Send notification via RabbitMQ

MessageNotificationEvent event =
        new MessageNotificationEvent(
                saved.getSenderId(),
                saved.getReceiverId(),
                saved.getMessage()
        );

rabbitTemplate.convertAndSend(
        RabbitMQConfig.MESSAGE_NOTIFICATION_EXCHANGE,
        RabbitMQConfig.MESSAGE_NOTIFICATION_ROUTING_KEY,
        event
);


    return convertToResponse(saved);
}

    public List<MessageResponse> getConversation(
            Long user1,
            Long user2) {

        return chatMessageRepository
                .findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByCreatedAtAsc(
                        user1,
                        user2,
                        user2,
                        user1
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<MessageResponse> getUnreadMessages(
            Long userId) {

        return chatMessageRepository
                .findByReceiverIdAndIsReadFalseOrderByCreatedAtAsc(
                        userId
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public MessageResponse markAsRead(Long id) {

        ChatMessage chatMessage =
                chatMessageRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Message not found with id: " + id
                                )
                        );

        chatMessage.setRead(true);

        ChatMessage updated =
                chatMessageRepository.save(chatMessage);

        return convertToResponse(updated);
    }

    public void deleteMessage(Long id) {

        ChatMessage chatMessage =
                chatMessageRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Message not found with id: " + id
                                )
                        );

        chatMessageRepository.delete(chatMessage);
    }

    private MessageResponse convertToResponse(
            ChatMessage chatMessage) {

        return new MessageResponse(
                chatMessage.getId(),
                chatMessage.getSenderId(),
                chatMessage.getReceiverId(),
                chatMessage.getMessage(),
                chatMessage.isRead(),
                chatMessage.getCreatedAt()
        );
    }
    public List<Long> getConversationUserIds(Long userId) {

    return chatMessageRepository
            .findConversationUserIds(userId);
}
}