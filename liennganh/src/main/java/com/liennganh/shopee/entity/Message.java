package com.liennganh.shopee.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entity đại diện cho Tin nhắn (Message)
 * Thuộc về 1 hội thoại (Conversation), gửi bởi 1 người dùng (User)
 */
@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    @lombok.EqualsAndHashCode.Exclude
    @lombok.ToString.Exclude
    private Conversation conversation; // Hội thoại chứa tin nhắn này

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    @lombok.EqualsAndHashCode.Exclude
    @lombok.ToString.Exclude
    private User sender; // Người gửi

    @Column(columnDefinition = "TEXT")
    private String content; // Nội dung tin nhắn

    @Column(name = "is_read")
    private boolean isRead = false; // Trạng thái đã đọc

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
