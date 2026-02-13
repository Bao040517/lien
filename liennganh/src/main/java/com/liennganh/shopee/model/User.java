package com.liennganh.shopee.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "seller_status")
    private SellerStatus sellerStatus;

    @Column(name = "is_locked")
    private Boolean isLocked = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Role {
        USER, // Người mua
        SELLER, // Người bán
        ADMIN // Quản trị viên
    }

    public enum SellerStatus {
        PENDING, // Chờ duyệt
        APPROVED, // Đã duyệt
        REJECTED, // Từ chối
        SUSPENDED // Tạm khóa
    }
}
