package com.liennganh.shopee.service.notification;

import com.liennganh.shopee.entity.Notification;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.repository.notification.NotificationRepository;
import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service quản lý thông báo (Notification)
 * Tạo, lưu trữ và đánh dấu trạng thái thông báo
 */
@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Tạo và lưu một thông báo mới
     * 
     */
    public Notification createNotification(User user, String title, String message, Notification.NotificationType type,
            Long referenceId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        return notificationRepository.save(notification);
    }

    /**
     * Lấy danh sách thông báo của người dùng, sắp xếp mới nhất lên đầu
     * 
     */
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * ��nh d?u m?t th�ng b�o l� d� d?c
     * 
     * @throws AppException NOTIFICATION_NOT_FOUND nếu không tìm thấy
     */
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    /**
     * Đếm số lượng thông báo chưa đọc của người dùng
     * 
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
}
