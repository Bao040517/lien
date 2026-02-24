package com.liennganh.shopee.repository.product;

import com.liennganh.shopee.entity.ProductAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository quản lý thuộc tính sản phẩm (Màu sắc, Kích thước...)
 */
public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, Long> {
    /**
     * Lấy danh sách thuộc tính của một sản phẩm
     */
    List<ProductAttribute> findByProductId(Long productId);
}
