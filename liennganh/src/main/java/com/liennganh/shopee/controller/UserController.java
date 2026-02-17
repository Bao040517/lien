package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.dto.response.UserResponse;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.service.user.UserService;
import com.liennganh.shopee.service.auth.JwtService;
import com.liennganh.shopee.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý người dùng
 * User/Seller chỉ xem được chính mình, Admin xem được tất cả
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    /**
     * Lấy danh sách tất cả người dùng
     * Quyền hạn: ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<List<User>> getAllUsers() {
        return ApiResponse.success(userService.getAllUsers(), "Lấy danh sách người dùng thành công");
    }

    /**
     * Xem thông tin chi tiết của một người dùng
     * User/Seller chỉ xem được chính mình, Admin xem được tất cả
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(id, currentUserId);
        return ApiResponse.success(userService.getUserById(id), "Lấy thông tin người dùng thành công");
    }

    /**
     * Yêu cầu nâng cấp tài khoản từ User lên Seller
     * Chỉ user chính chủ mới được yêu cầu
     * Quyền hạn: USER
     */
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{id}/upgrade-seller")
    public ApiResponse<UserResponse> requestSellerUpgrade(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(id, currentUserId);
        return ApiResponse.success(userService.requestSellerUpgrade(id),
                "Yêu cầu nâng cấp thành người bán thành công. Vui lòng chờ Admin phê duyệt.");
    }
}
