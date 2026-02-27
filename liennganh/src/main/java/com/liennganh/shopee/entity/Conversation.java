package com.liennganh.shopee.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

/**
 * Entity đại diện cho Hội thoại (Conversation)
 * Mỗi hội thoại là giữa 2 người dùng (1-1)
 */
@Entity
@Table(name = "conversations")
@SQLDelete(sql = "UPDATE conversations SET deleted = true, deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted = false")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user1_id", nullable = false)
    @lombok.EqualsAndHashCode.Exclude
    @lombok.ToString.Exclude
    private User user1; // Người tham gia 1

    @ManyToOne
    @JoinColumn(name = "user2_id", nullable = false)
    @lombok.EqualsAndHashCode.Exclude
    @lombok.ToString.Exclude
    private User user2; // Người tham gia 2

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // Cập nhật khi có tin nhắn mới

    // Soft Delete
    @Column(name = "deleted", columnDefinition = "boolean default false")
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Transient
    private String lastMessageContent; // Nội dung tin nhắn cuối (không lưu DB)

    @Transient
    private LocalDateTime lastMessageTime; // Thời gian tin nhắn cuối

    @Transient
    private int unreadCount; // Số tin chưa đọc

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
