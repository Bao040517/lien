package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.dto.response.UserResponse;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller quản lý người dùng
 * Cung cấp các API để xem danh sách, chi tiết và nâng cấp tài khoản
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    /**
     * Lấy danh sách tất cả người dùng
     * Chỉ dành cho Admin
     * Quyền hạn: ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<List<User>> getAllUsers() {
        return ApiResponse.success(userService.getAllUsers(), "Lấy danh sách người dùng thành công");
    }

    /**
     * Xem thông tin chi tiết của một người dùng
     * Dành cho chính user đó hoặc Admin
     * Quyền hạn: USER (chính chủ), SELLER (chính chủ), ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        return ApiResponse.success(userService.getUserById(id), "Lấy thông tin người dùng thành công");
    }

    /**
     * Yêu cầu nâng cấp tài khoản từ User lên Seller
     * Quyền hạn: USER
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('USER')")
    @PostMapping("/{id}/upgrade-seller")
    public ApiResponse<UserResponse> requestSellerUpgrade(@PathVariable Long id) {
        return ApiResponse.success(userService.requestSellerUpgrade(id),
                "Yêu cầu nâng cấp thành người bán thành công. Vui lòng chờ Admin phê duyệt.");
    }
}
