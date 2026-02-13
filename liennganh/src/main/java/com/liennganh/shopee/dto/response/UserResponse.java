package com.liennganh.shopee.dto.response;

import com.liennganh.shopee.model.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private User.Role role;
    private User.SellerStatus sellerStatus;
    private boolean isLocked;

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
