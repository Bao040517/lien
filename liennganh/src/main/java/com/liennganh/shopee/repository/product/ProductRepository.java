package com.liennganh.shopee.repository.product;

import com.liennganh.shopee.entity.Product;
import com.liennganh.shopee.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Repository quản lý sản phẩm
 * Hỗ trợ các phương thức tìm kiếm cơ bản và nâng cao (Specification)
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    /**
     * Tìm sản phẩm theo ID danh mục (chỉ lấy sp chưa bị khóa)
     */
    List<Product> findByCategoryIdAndIsBannedFalse(Long categoryId);

    /**
     * Tìm kiếm sản phẩm theo tên (không phân biệt hoa thường, chưa bị khóa)
     */
    List<Product> findByNameContainingIgnoreCaseAndIsBannedFalse(String name);

    /**
     * Tìm tất cả sản phẩm của một Shop (kể cả bị khóa - dùng cho Seller quản lý)
     */
    List<Product> findByShop(Shop shop);

    /**
     * Đếm tổng số sản phẩm của một Shop
     */
    Long countByShop(Shop shop);

    /**
     * Tìm sản phẩm của Shop (chỉ lấy sp chưa bị khóa - dùng cho User xem shop)
     */
    List<Product> findByShopAndIsBannedFalse(Shop shop);
}
