package com.liennganh.shopee.repository.message;

import com.liennganh.shopee.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

/**
 * Repository cho entity Conversation (Hội thoại)
 */
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    /**
     * Lấy tất cả hội thoại của 1 user (user có thể là user1 hoặc user2)
     * Sắp xếp theo thời gian cập nhật mới nhất
     */
    @Query("SELECT c FROM Conversation c WHERE c.user1.id = :userId OR c.user2.id = :userId ORDER BY c.updatedAt DESC")
    List<Conversation> findByUserId(@Param("userId") Long userId);

    /**
     * Tìm hội thoại giữa 2 user cụ thể (không phân biệt thứ tự)
     */
    @Query("SELECT c FROM Conversation c WHERE (c.user1.id = :uid1 AND c.user2.id = :uid2) OR (c.user1.id = :uid2 AND c.user2.id = :uid1)")
    Optional<Conversation> findByTwoUsers(@Param("uid1") Long uid1, @Param("uid2") Long uid2);
}
