package com.liennganh.shopee.repository.product;

import com.liennganh.shopee.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository quản lý biến thể sản phẩm (Variant)
 * Ví dụ: Áo phông - Đỏ - Size M
 */
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    /**
     * Lấy danh sách biến thể của một sản phẩm
     */
    List<ProductVariant> findByProductId(Long productId);
}
