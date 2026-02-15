package com.liennganh.shopee.repository;

import com.liennganh.shopee.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    List<Order> findByStatus(Order.OrderStatus status);

    Long countByStatus(Order.OrderStatus status);

    java.util.Optional<Order> findFirstByUserIdAndOrderItemsProductIdAndStatusOrderByCreatedAtDesc(Long userId,
            Long productId, Order.OrderStatus status);
}
