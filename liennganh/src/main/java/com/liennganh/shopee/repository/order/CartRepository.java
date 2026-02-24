package com.liennganh.shopee.repository.order;

import com.liennganh.shopee.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository quản lý giỏ hàng (Cart)
 */
public interface CartRepository extends JpaRepository<Cart, Long> {
    /**
     * Tìm giỏ hàng của User
     */
    Optional<Cart> findByUserId(Long userId);
}
