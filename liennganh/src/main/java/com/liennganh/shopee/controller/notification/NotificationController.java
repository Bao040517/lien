package com.liennganh.shopee.controller.notification;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Notification;
import com.liennganh.shopee.service.notification.NotificationService;
import com.liennganh.shopee.service.auth.JwtService;
import com.liennganh.shopee.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

/**
 * Controller quáº£n lÃ½ thÃ´ng bÃ¡o
 * User/Seller chá»‰ xem Ä‘Æ°á»£c thÃ´ng bÃ¡o cá»§a mÃ¬nh, Admin xem Ä‘Æ°á»£c táº¥t cáº£
 */
@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private JwtService jwtService;

    /**
     * Láº¥y danh sÃ¡ch thÃ´ng bÃ¡o cá»§a ngÆ°á»i dÃ¹ng hiá»‡n táº¡i
     * User/Seller chá»‰ xem Ä‘Æ°á»£c thÃ´ng bÃ¡o cá»§a mÃ¬nh, Admin xem Ä‘Æ°á»£c táº¥t cáº£
     */
    @GetMapping
    public ApiResponse<List<Notification>> getMyNotifications(@RequestParam Long userId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(notificationService.getUserNotifications(userId),
                "Láº¥y danh sÃ¡ch thÃ´ng bÃ¡o thÃ nh cÃ´ng");
    }

    /**
     * ÄÃ¡nh dáº¥u má»™t thÃ´ng bÃ¡o lÃ  Ä‘Ã£ Ä‘á»c
     */
    @PutMapping("/{id}/read")
    public ApiResponse<Notification> markAsRead(@PathVariable Long id) {
        return ApiResponse.success(notificationService.markAsRead(id), "ÄÃ¡nh dáº¥u Ä‘Ã£ Ä‘á»c thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y sá»‘ lÆ°á»£ng thÃ´ng bÃ¡o chÆ°a Ä‘á»c
     * User/Seller chá»‰ xem Ä‘Æ°á»£c cá»§a mÃ¬nh, Admin xem Ä‘Æ°á»£c táº¥t cáº£
     */
    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount(@RequestParam Long userId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(notificationService.getUnreadCount(userId), "Láº¥y sá»‘ lÆ°á»£ng tin chÆ°a Ä‘á»c thÃ nh cÃ´ng");
    }
}

