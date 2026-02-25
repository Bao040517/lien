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
 * Controller xử lý API Tin nhắn (Messaging)
 * Hỗ trợ nhắn tin qua lại giữa USER, SELLER và ADMIN
 */
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    /**
     * Lấy danh sách hội thoại của user hiện tại
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

        return ResponseEntity.ok(ApiResponse.success(result, "Lấy danh sách hội thoại thành công"));
    }

    /**
     * Tạo hoặc tìm hội thoại giữa 2 user
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

        return ResponseEntity.ok(ApiResponse.success(result, "Tạo hội thoại thành công"));
    }

    /**
     * Lấy tin nhắn trong hội thoại
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

        return ResponseEntity.ok(ApiResponse.success(result, "Lấy tin nhắn thành công"));
    }

    /**
     * Gửi tin nhắn
     */
    @PostMapping("/{conversationId}")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long conversationId,
            @RequestParam Long senderId,
            @RequestBody Map<String, String> body) {
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Nội dung tin nhắn không được để trống"));
        }

        Message message = messageService.sendMessage(conversationId, senderId, content.trim());

        Map<String, Object> result = new HashMap<>();
        result.put("id", message.getId());
        result.put("content", message.getContent());
        result.put("senderId", message.getSender().getId());
        result.put("senderName", message.getSender().getUsername());
        result.put("createdAt", message.getCreatedAt());

        return ResponseEntity.ok(ApiResponse.success(result, "Gửi tin nhắn thành công"));
    }

    /**
     * Đánh dấu đã đọc
     */
    @PutMapping("/{conversationId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long conversationId,
            @RequestParam Long userId) {
        messageService.markAsRead(conversationId, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Đã đánh dấu đọc"));
    }

    /**
     * Lấy số tin chưa đọc
     */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@RequestParam Long userId) {
        int count = messageService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count, "Lấy số tin chưa đọc thành công"));
    }

    /**
     * Tìm kiếm user để bắt đầu hội thoại mới
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

        return ResponseEntity.ok(ApiResponse.success(result, "Tìm kiếm user thành công"));
    }
}

