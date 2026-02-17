package com.liennganh.shopee.dto.request;

import lombok.Data;

/**
 * DTO cho yêu cầu đăng nhập
 */
@Data
public class LoginRequest {
    private String username; // Tên đăng nhập
    private String password; // Mật khẩu

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
