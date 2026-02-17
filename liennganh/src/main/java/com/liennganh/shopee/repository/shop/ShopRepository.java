package com.liennganh.shopee.repository.shop;

import com.liennganh.shopee.entity.Shop;
import com.liennganh.shopee.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository quản lý thông tin cửa hàng (Shop)
 */
public interface ShopRepository extends JpaRepository<Shop, Long> {
    /**
     * Kiểm tra xem user này đã có Shop chưa
     */
    boolean existsByOwner(User owner);

    /**
     * Tìm Shop thuộc sở hữu của một User
     */
    Optional<Shop> findByOwner(User owner);
}
