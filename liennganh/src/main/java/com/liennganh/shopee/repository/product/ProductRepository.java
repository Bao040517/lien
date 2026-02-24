package com.liennganh.shopee.repository.product;

import com.liennganh.shopee.entity.Product;
import com.liennganh.shopee.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    Page<Product> findByCategoryIdAndIsBannedFalse(Long categoryId, Pageable pageable);

    /**
     * Tìm kiếm sản phẩm theo tên (không phân biệt hoa thường, chưa bị khóa)
     */
    Page<Product> findByNameContainingIgnoreCaseAndIsBannedFalse(String name, Pageable pageable);

    /**
     * Tìm tất cả sản phẩm của một Shop (kể cả bị khóa - dùng cho Seller quản lý) có
     * phân trang
     */
    Page<Product> findByShop(Shop shop, Pageable pageable);

    /**
     * Tìm tất cả sản phẩm của một Shop (Không phân trang - dùng nội bộ cho tính
     * toán Statistics)
     */
    List<Product> findAllByShop(Shop shop);

    /**
     * Đếm tổng số sản phẩm của một Shop
     */
    Long countByShop(Shop shop);

    /**
     * Tìm sản phẩm của Shop (chỉ lấy sp chưa bị khóa - dùng cho User xem shop)
     */
    Page<Product> findByShopAndIsBannedFalse(Shop shop, Pageable pageable);

    /**
     * Lấy tất cả sản phẩm chưa bị khóa (dùng cho User xem danh sách)
     */
    Page<Product> findByIsBannedFalse(Pageable pageable);
}
