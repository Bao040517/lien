package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.model.Notification;
import com.liennganh.shopee.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ApiResponse<List<Notification>> getMyNotifications(@RequestParam Long userId) {
        return ApiResponse.success(notificationService.getUserNotifications(userId),
                "Retrieved notifications");
    }

    @PutMapping("/{id}/read")
    public ApiResponse<Notification> markAsRead(@PathVariable Long id) {
        return ApiResponse.success(notificationService.markAsRead(id), "Marked as read");
    }

    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount(@RequestParam Long userId) {
        return ApiResponse.success(notificationService.getUnreadCount(userId), "Unread count");
    }
}
