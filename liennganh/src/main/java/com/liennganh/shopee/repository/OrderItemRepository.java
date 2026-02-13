package com.liennganh.shopee.repository;

import com.liennganh.shopee.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByProductIdIn(List<Long> productIds);
}
