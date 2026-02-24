package com.liennganh.shopee.controller.message;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Conversation;
import com.liennganh.shopee.entity.Message;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.service.message.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller xá»­ lÃ½ API Tin nháº¯n (Messaging)
 * Há»— trá»£ nháº¯n tin qua láº¡i giá»¯a USER, SELLER vÃ  ADMIN
 */
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    /**
     * Láº¥y danh sÃ¡ch há»™i thoáº¡i cá»§a user hiá»‡n táº¡i
     */
    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(@RequestParam Long userId) {
        List<Conversation> conversations = messageService.getConversations(userId);

        List<Map<String, Object>> result = conversations.stream().map(conv -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", conv.getId());

            User otherUser = conv.getUser1().getId().equals(userId) ? conv.getUser2() : conv.getUser1();
            Map<String, Object> otherUserMap = new HashMap<>();
            otherUserMap.put("id", otherUser.getId());
            otherUserMap.put("username", otherUser.getUsername());
            otherUserMap.put("role", otherUser.getRole().name());
            map.put("otherUser", otherUserMap);

            map.put("lastMessage", conv.getLastMessageContent());
            map.put("lastMessageTime", conv.getLastMessageTime());
            map.put("unreadCount", conv.getUnreadCount());
            map.put("updatedAt", conv.getUpdatedAt());
            return map;
        }).toList();

        return ResponseEntity.ok(ApiResponse.success(result, "Láº¥y danh sÃ¡ch há»™i thoáº¡i thÃ nh cÃ´ng"));
    }

    /**
     * Táº¡o hoáº·c tÃ¬m há»™i thoáº¡i giá»¯a 2 user
     */
    @PostMapping("/conversations")
    public ResponseEntity<?> getOrCreateConversation(
            @RequestParam Long userId1,
            @RequestParam Long userId2) {
        Conversation conv = messageService.getOrCreateConversation(userId1, userId2);

        Map<String, Object> result = new HashMap<>();
        result.put("id", conv.getId());

        Map<String, Object> u1 = new HashMap<>();
        u1.put("id", conv.getUser1().getId());
        u1.put("username", conv.getUser1().getUsername());
        u1.put("role", conv.getUser1().getRole().name());
        result.put("user1", u1);

        Map<String, Object> u2 = new HashMap<>();
        u2.put("id", conv.getUser2().getId());
        u2.put("username", conv.getUser2().getUsername());
        u2.put("role", conv.getUser2().getRole().name());
        result.put("user2", u2);

        return ResponseEntity.ok(ApiResponse.success(result, "Táº¡o há»™i thoáº¡i thÃ nh cÃ´ng"));
    }

    /**
     * Láº¥y tin nháº¯n trong há»™i thoáº¡i
     */
    @GetMapping("/{conversationId}")
    public ResponseEntity<?> getMessages(
            @PathVariable Long conversationId,
            @RequestParam Long userId) {
        messageService.markAsRead(conversationId, userId);

        List<Message> messages = messageService.getMessages(conversationId);

        List<Map<String, Object>> result = messages.stream().map(msg -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", msg.getId());
            map.put("content", msg.getContent());
            map.put("senderId", msg.getSender().getId());
            map.put("senderName", msg.getSender().getUsername());
            map.put("senderRole", msg.getSender().getRole().name());
            map.put("isRead", msg.isRead());
            map.put("createdAt", msg.getCreatedAt());
            return map;
        }).toList();

        return ResponseEntity.ok(ApiResponse.success(result, "Láº¥y tin nháº¯n thÃ nh cÃ´ng"));
    }

    /**
     * Gá»­i tin nháº¯n
     */
    @PostMapping("/{conversationId}")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long conversationId,
            @RequestParam Long senderId,
            @RequestBody Map<String, String> body) {
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Ná»™i dung tin nháº¯n khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng"));
        }

        Message message = messageService.sendMessage(conversationId, senderId, content.trim());

        Map<String, Object> result = new HashMap<>();
        result.put("id", message.getId());
        result.put("content", message.getContent());
        result.put("senderId", message.getSender().getId());
        result.put("senderName", message.getSender().getUsername());
        result.put("createdAt", message.getCreatedAt());

        return ResponseEntity.ok(ApiResponse.success(result, "Gá»­i tin nháº¯n thÃ nh cÃ´ng"));
    }

    /**
     * ÄÃ¡nh dáº¥u Ä‘Ã£ Ä‘á»c
     */
    @PutMapping("/{conversationId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long conversationId,
            @RequestParam Long userId) {
        messageService.markAsRead(conversationId, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "ÄÃ£ Ä‘Ã¡nh dáº¥u Ä‘á»c"));
    }

    /**
     * Láº¥y sá»‘ tin chÆ°a Ä‘á»c
     */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@RequestParam Long userId) {
        int count = messageService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count, "Láº¥y sá»‘ tin chÆ°a Ä‘á»c thÃ nh cÃ´ng"));
    }

    /**
     * TÃ¬m kiáº¿m user Ä‘á»ƒ báº¯t Ä‘áº§u há»™i thoáº¡i má»›i
     */
    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(
            @RequestParam String keyword,
            @RequestParam Long currentUserId) {
        List<User> users = messageService.searchUsers(keyword, currentUserId);

        List<Map<String, Object>> result = users.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("email", u.getEmail());
            map.put("role", u.getRole().name());
            return map;
        }).toList();

        return ResponseEntity.ok(ApiResponse.success(result, "TÃ¬m kiáº¿m user thÃ nh cÃ´ng"));
    }
}

