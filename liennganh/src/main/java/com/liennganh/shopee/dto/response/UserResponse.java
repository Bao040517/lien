package com.liennganh.shopee.dto.response;

import com.liennganh.shopee.entity.User;
import lombok.Data;

/**
 * DTO phản hồi thông tin User (ẩn mật khẩu)
 */
@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private User.Role role;
    private User.SellerStatus sellerStatus;
    private boolean isLocked;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
        this.role = role;
    }

    public User.SellerStatus getSellerStatus() {
        return sellerStatus;
    }

    public void setSellerStatus(User.SellerStatus sellerStatus) {
        this.sellerStatus = sellerStatus;
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void setLocked(boolean locked) {
        isLocked = locked;
    }

    /**
     * Chuyển đổi từ Entity User sang UserResponse
     */
    public static UserResponse fromUser(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setSellerStatus(user.getSellerStatus());
        response.setLocked(Boolean.TRUE.equals(user.getIsLocked()));
        return response;
    }
}
