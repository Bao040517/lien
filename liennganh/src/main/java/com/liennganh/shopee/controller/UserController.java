package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.dto.response.UserResponse;
import com.liennganh.shopee.model.User;
import com.liennganh.shopee.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ApiResponse<List<User>> getAllUsers() {
        return ApiResponse.success(userService.getAllUsers(), "Users retrieved successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ApiResponse.success(user, "User retrieved successfully");
    }

    @org.springframework.web.bind.annotation.PostMapping("/{id}/upgrade-seller")
    public ApiResponse<UserResponse> requestSellerUpgrade(
            @org.springframework.web.bind.annotation.PathVariable Long id) {
        UserResponse user = userService.requestSellerUpgrade(id);
        return ApiResponse.success(user, "Seller upgrade requested successfully. Please wait for admin approval.");
    }
}
