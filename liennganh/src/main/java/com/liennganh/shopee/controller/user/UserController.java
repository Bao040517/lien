package com.liennganh.shopee.controller.user;

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
 * Controller quáº£n lÃ½ ngÆ°á»i dÃ¹ng
 * User/Seller chá»‰ xem Ä‘Æ°á»£c chÃ­nh mÃ¬nh, Admin xem Ä‘Æ°á»£c táº¥t cáº£
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    /**
     * Láº¥y danh sÃ¡ch táº¥t cáº£ ngÆ°á»i dÃ¹ng
     * Quyá»n háº¡n: ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<List<User>> getAllUsers() {
        return ApiResponse.success(userService.getAllUsers(), "Láº¥y danh sÃ¡ch ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng");
    }

    /**
     * Xem thÃ´ng tin chi tiáº¿t cá»§a má»™t ngÆ°á»i dÃ¹ng
     * User/Seller chá»‰ xem Ä‘Æ°á»£c chÃ­nh mÃ¬nh, Admin xem Ä‘Æ°á»£c táº¥t cáº£
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(id, currentUserId);
        return ApiResponse.success(userService.getUserById(id), "Láº¥y thÃ´ng tin ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng");
    }

    /**
     * YÃªu cáº§u nÃ¢ng cáº¥p tÃ i khoáº£n tá»« User lÃªn Seller
     * Chá»‰ user chÃ­nh chá»§ má»›i Ä‘Æ°á»£c yÃªu cáº§u
     * Quyá»n háº¡n: USER
     */
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{id}/upgrade-seller")
    public ApiResponse<UserResponse> requestSellerUpgrade(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(id, currentUserId);
        return ApiResponse.success(userService.requestSellerUpgrade(id),
                "YÃªu cáº§u nÃ¢ng cáº¥p thÃ nh ngÆ°á»i bÃ¡n thÃ nh cÃ´ng. Vui lÃ²ng chá» Admin phÃª duyá»‡t.");
    }
}

