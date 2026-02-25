package com.liennganh.shopee.repository.order;

import com.liennganh.shopee.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repository quản lý đơn hàng (Order)
 */
public interface OrderRepository extends JpaRepository<Order, Long> {
        /**
         * Lấy danh sách đơn hàng của một User
         */
        List<Order> findByUserId(Long userId);

        /**
         * Lấy danh sách đơn hàng theo trạng thái (PENDING, SHIPPING...)
         */
        List<Order> findByStatus(Order.OrderStatus status);

        /**
         * Đếm số lượng đơn hàng theo trạng thái
         */
        Long countByStatus(Order.OrderStatus status);

        /**
         * Tìm đơn hàng hoàn thành mới nhất chứa sản phẩm cụ thể của user
         * Dùng để kiểm tra điều kiện đánh giá sản phẩm (Review)
         */
        @Query("SELECT o FROM Order o JOIN o.orderItems oi WHERE o.user.id = :userId AND oi.product.id = :productId AND o.status = :status ORDER BY o.createdAt DESC")
        java.util.Optional<Order> findFirstByUserIdAndOrderItemsProductIdAndStatusOrderByCreatedAtDesc(
                        @Param("userId") Long userId,
                        @Param("productId") Long productId,
                        @Param("status") Order.OrderStatus status);

        // ========== Thống kê doanh thu (Statistics) ==========

        /**
         * Lấy danh sách kết hợp đơn hàng của một Shop cụ thể
         */
        @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems oi JOIN oi.product p WHERE p.shop.id = :shopId ORDER BY o.createdAt DESC")
        List<Order> findByShopId(@Param("shopId") Long shopId);

        /**
         * Thống kê doanh thu toàn hệ thống theo ngày (Admin)
         * Ch? t�nh c�c don h�ng d� giao th�nh c�ng (DELIVERED)
         */
        @Query("SELECT FUNCTION('DATE', o.createdAt) as date, SUM(o.finalPrice) as revenue " +
                        "FROM Order o WHERE o.status = 'DELIVERED' " +
                        "GROUP BY FUNCTION('DATE', o.createdAt) ORDER BY date")
        List<Object[]> getSystemRevenueByDate();

        /**
         * Thống kê số lượng đơn hàng toàn hệ thống theo ngày (Admin)
         */
        @Query("SELECT FUNCTION('DATE', o.createdAt) as date, COUNT(o) as count " +
                        "FROM Order o " +
                        "GROUP BY FUNCTION('DATE', o.createdAt) ORDER BY date")
        List<Object[]> getSystemOrdersByDate();

        /**
         * Thống kê doanh thu của Shop theo ngày (Seller)
         * T�nh t?ng ti?n c�c m�n h�ng thu?c shop trong c�c don d� giao
         */
        @Query("SELECT FUNCTION('DATE', o.createdAt) as date, SUM(oi.price * oi.quantity) as revenue " +
                        "FROM OrderItem oi " +
                        "JOIN oi.order o " +
                        "JOIN oi.product p " +
                        "WHERE p.shop.id = :shopId AND o.status = 'DELIVERED' " +
                        "GROUP BY FUNCTION('DATE', o.createdAt) ORDER BY date")
        List<Object[]> getSellerRevenueByDate(@Param("shopId") Long shopId);

        /**
         * Thống kê số lượng đơn hàng của Shop theo ngày (Seller)
         * Đếm số đơn hàng có chứa sản phẩm của shop
         */
        @Query("SELECT FUNCTION('DATE', o.createdAt) as date, COUNT(DISTINCT o.id) as count " +
                        "FROM OrderItem oi " +
                        "JOIN oi.order o " +
                        "JOIN oi.product p " +
                        "WHERE p.shop.id = :shopId " +
                        "GROUP BY FUNCTION('DATE', o.createdAt) ORDER BY date")
        List<Object[]> getSellerOrdersByDate(@Param("shopId") Long shopId);
}
