package com.liennganh.shopee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response trả về khi login thành công
 * Bao gồm thông tin user và JWT token
 */
public class LoginResponse {
    private UserResponse user; // Thông tin user
    private String token; // JWT token để authenticate các request sau

    public LoginResponse() {
    }

    public LoginResponse(UserResponse user, String token) {
        this.user = user;
        this.token = token;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
