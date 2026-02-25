package com.liennganh.shopee.repository.message;

import com.liennganh.shopee.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Repository cho entity Message (Tin nhắn)
 */
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Lấy tất cả tin nhắn của 1 hội thoại, sắp xếp theo thời gian tăng dần
     */
    List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId);

    /**
     * Đếm số tin chưa đọc trong 1 hội thoại (tin mà người khác gửi và mình chưa
     * đọc)
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation.id = :convId AND m.sender.id != :userId AND m.isRead = false")
    int countUnreadInConversation(@Param("convId") Long convId, @Param("userId") Long userId);

    /**
     * Đếm tổng tin chưa đọc của 1 user trên tất cả hội thoại
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.sender.id != :userId AND m.isRead = false AND (m.conversation.user1.id = :userId OR m.conversation.user2.id = :userId)")
    int countTotalUnread(@Param("userId") Long userId);

    /**
     * ��nh d?u t?t c? tin nh?n trong h?i tho?i l� d� d?c (tin m� ngu?i kh�c g?i)
     */
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.conversation.id = :convId AND m.sender.id != :userId AND m.isRead = false")
    void markAllAsRead(@Param("convId") Long convId, @Param("userId") Long userId);

    /**
     * Lấy tin nhắn cuối cùng của 1 hội thoại
     */
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :convId ORDER BY m.createdAt DESC LIMIT 1")
    Message findLastMessage(@Param("convId") Long convId);
}
