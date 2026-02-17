package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Notification;
import com.liennganh.shopee.service.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

/**
 * Controller quản lý thông báo
 * Cho phép người dùng xem danh sách thông báo và đánh dấu đã đọc
 * Yêu cầu đăng nhập để sử dụng
 */
@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Lấy danh sách thông báo của người dùng hiện tại
     * Quyền hạn: USER, SELLER, ADMIN
     * 
     */
    @GetMapping
    public ApiResponse<List<Notification>> getMyNotifications(@RequestParam Long userId) {
        return ApiResponse.success(notificationService.getUserNotifications(userId),
                "Lấy danh sách thông báo thành công");
    }

    /**
     * Đánh dấu một thông báo là đã đọc
     * Quyền hạn: USER, SELLER, ADMIN
     * 
     */
    @PutMapping("/{id}/read")
    public ApiResponse<Notification> markAsRead(@PathVariable Long id) {
        return ApiResponse.success(notificationService.markAsRead(id), "Đánh dấu đã đọc thành công");
    }

    /**
     * Lấy số lượng thông báo chưa đọc của người dùng
     * Quyền hạn: USER, SELLER, ADMIN
     * 
     */
    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount(@RequestParam Long userId) {
        return ApiResponse.success(notificationService.getUnreadCount(userId), "Lấy số lượng tin chưa đọc thành công");
    }
}
