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
     * Ki?m tra xem user n�y d� c� Shop chua
     */
    boolean existsByOwner(User owner);

    /**
     * Tìm Shop thuộc sở hữu của một User
     */
    Optional<Shop> findByOwner(User owner);

    /**
     * Tìm kiếm Shop theo tên (gần đúng, không phân biệt hoa thường)
     */
    java.util.List<Shop> findByNameContainingIgnoreCase(String name);
}
