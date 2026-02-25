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
 * Controller quản lý thông báo
 * User/Seller chỉ xem được thông báo của mình, Admin xem được tất cả
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
     * Lấy danh sách thông báo của người dùng hiện tại
     * User/Seller chỉ xem được thông báo của mình, Admin xem được tất cả
     */
    @GetMapping
    public ApiResponse<List<Notification>> getMyNotifications(@RequestParam Long userId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(notificationService.getUserNotifications(userId),
                "Lấy danh sách thông báo thành công");
    }

    /**
     * Đánh dấu một thông báo là đã đọc
     */
    @PutMapping("/{id}/read")
    public ApiResponse<Notification> markAsRead(@PathVariable Long id) {
        return ApiResponse.success(notificationService.markAsRead(id), "Đánh dấu đã đọc thành công");
    }

    /**
     * Lấy số lượng thông báo chưa đọc
     * User/Seller chỉ xem được của mình, Admin xem được tất cả
     */
    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount(@RequestParam Long userId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(notificationService.getUnreadCount(userId), "Lấy số lượng tin chưa đọc thành công");
    }
}

