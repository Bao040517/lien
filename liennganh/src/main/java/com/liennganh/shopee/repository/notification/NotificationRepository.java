package com.liennganh.shopee.repository.notification;

import com.liennganh.shopee.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository quản lý thông báo (Notification)
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    /**
     * Lấy danh sách thông báo của user, sắp xếp mới nhất lên đầu
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Đếm số lượng thông báo chưa đọc của user
     */
    long countByUserIdAndIsReadFalse(Long userId);
}
