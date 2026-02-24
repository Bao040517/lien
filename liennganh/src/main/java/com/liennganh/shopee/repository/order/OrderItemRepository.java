package com.liennganh.shopee.repository.order;

import com.liennganh.shopee.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository quản lý chi tiết đơn hàng (OrderItem)
 */
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    /**
     * Tìm các OrderItem chứa các sản phẩm cụ thể
     * (Thường dùng để check ràng buộc khi xóa sản phẩm)
     */
    List<OrderItem> findByProductIdIn(List<Long> productIds);

    /**
     * Xóa tất cả OrderItem của sản phẩm (dùng khi xóa sản phẩm)
     */
    void deleteByProductId(Long productId);
}
