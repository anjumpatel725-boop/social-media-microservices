package com.socialmedia.chat.controller;

import com.socialmedia.chat.dto.MessageRequest;
import com.socialmedia.chat.dto.MessageResponse;
import com.socialmedia.chat.service.ChatService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @Valid @RequestBody MessageRequest request) {

        MessageResponse response =
                chatService.sendMessage(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<MessageResponse>>
    getConversation(
            @RequestParam Long user1,
            @RequestParam Long user2) {

        return ResponseEntity.ok(
                chatService.getConversation(
                        user1,
                        user2
                )
        );
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<MessageResponse>>
    getUnreadMessages(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                chatService.getUnreadMessages(userId)
        );
    }

    @PutMapping("/messages/{id}/read")
    public ResponseEntity<MessageResponse> markAsRead(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                chatService.markAsRead(id)
        );
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<String> deleteMessage(
            @PathVariable Long id) {

        chatService.deleteMessage(id);

        return ResponseEntity.ok(
                "Message deleted successfully"
        );
    }
    @GetMapping("/conversations/{userId}")
public ResponseEntity<List<Long>> getConversations(
        @PathVariable Long userId) {

    return ResponseEntity.ok(
            chatService.getConversationUserIds(userId)
    );
}
}