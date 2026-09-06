package com.socialmedia.chat.repository;

import com.socialmedia.chat.entity.ChatMessage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository
        extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage>
    findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByCreatedAtAsc(
            Long senderId,
            Long receiverId,
            Long receiverId2,
            Long senderId2
    );


    List<ChatMessage>
    findByReceiverIdAndIsReadFalseOrderByCreatedAtAsc(
            Long receiverId
    );


    @Query("""
        SELECT DISTINCT
            CASE
                WHEN c.senderId = :userId THEN c.receiverId
                ELSE c.senderId
            END
        FROM ChatMessage c
        WHERE c.senderId = :userId
           OR c.receiverId = :userId
    """)
    List<Long> findConversationUserIds(
            @Param("userId") Long userId
    );
}