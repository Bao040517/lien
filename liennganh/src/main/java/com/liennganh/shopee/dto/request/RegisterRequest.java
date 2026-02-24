package com.liennganh.shopee.dto.request;

import lombok.Data;

/**
 * DTO cho yêu cầu đăng ký tài khoản mới
 */
public class RegisterRequest {
    private String username; // Tên đăng nhập mong muốn
    private String email; // Email đăng ký
    private String password; // Mật khẩu

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
