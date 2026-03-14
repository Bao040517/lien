package com.liennganh.shopee.service.message;

import com.liennganh.shopee.entity.Conversation;
import com.liennganh.shopee.entity.Message;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.repository.message.ConversationRepository;
import com.liennganh.shopee.repository.message.MessageRepository;
import com.liennganh.shopee.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service xử lý logic nghiệp vụ cho Tin nhắn (Messaging)
 */
@Service
@RequiredArgsConstructor
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    /**
     * Lấy danh sách hội thoại của 1 user, kèm thông tin tin nhắn cuối + số tin chưa
     * đọc
     */
    public List<Conversation> getConversations(Long userId) {
        List<Conversation> conversations = conversationRepository.findByUserId(userId);

        for (Conversation conv : conversations) {
            // Lấy tin nhắn cuối
            Message lastMsg = messageRepository.findLastMessage(conv.getId());
            if (lastMsg != null) {
                conv.setLastMessageContent(lastMsg.getContent());
                conv.setLastMessageTime(lastMsg.getCreatedAt());
            }
            // Đếm tin chưa đọc
            int unread = messageRepository.countUnreadInConversation(conv.getId(), userId);
            conv.setUnreadCount(unread);
        }

        return conversations;
    }

    /**
     * Tìm hoặc tạo hội thoại giữa 2 user
     */
    public Conversation getOrCreateConversation(Long userId1, Long userId2) {
        return conversationRepository.findByTwoUsers(userId1, userId2)
                .orElseGet(() -> {
                    User u1 = userRepository.findById(userId1)
                            .orElseThrow(() -> new RuntimeException("User không tồn tại: " + userId1));
                    User u2 = userRepository.findById(userId2)
                            .orElseThrow(() -> new RuntimeException("User không tồn tại: " + userId2));

                    Conversation conv = new Conversation();
                    conv.setUser1(u1);
                    conv.setUser2(u2);
                    return conversationRepository.save(conv);
                });
    }

    /**
     * Lấy tất cả tin nhắn trong 1 hội thoại
     */
    public List<Message> getMessages(Long conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    /**
     * Gửi tin nhắn mới
     */
    public Message sendMessage(Long conversationId, Long senderId, String content) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Hội thoại không tồn tại: " + conversationId));
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại: " + senderId));

        Message message = new Message();
        message.setConversation(conv);
        message.setSender(sender);
        message.setContent(content);
        message.setRead(false);

        // Cập nhật thời gian hội thoại
        conv.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conv);

        return messageRepository.save(message);
    }

    /**
     * Đánh dấu tất cả tin nhắn trong hội thoại là đã đọc
     */
    @Transactional
    public void markAsRead(Long conversationId, Long userId) {
        messageRepository.markAllAsRead(conversationId, userId);
    }

    /**
     * Đếm tổng tin chưa đọc của 1 user
     */
    public int getUnreadCount(Long userId) {
        return messageRepository.countTotalUnread(userId);
    }

    /**
     * Tìm kiếm user để bắt đầu hội thoại mới
     */
    public List<User> searchUsers(String keyword, Long currentUserId) {
        return userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .filter(u -> u.getUsername().toLowerCase().contains(keyword.toLowerCase())
                        || u.getEmail().toLowerCase().contains(keyword.toLowerCase()))
                .limit(20)
                .toList();
    }
}
