package com.liennganh.shopee.repository.product;

import com.liennganh.shopee.entity.ProductAttributeOption;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository quản lý các giá trị của thuộc tính (Đỏ, Xanh, S, M...)
 */
public interface ProductAttributeOptionRepository extends JpaRepository<ProductAttributeOption, Long> {
    /**
     * Lấy danh sách giá trị của một thuộc tính
     */
    List<ProductAttributeOption> findByAttributeId(Long attributeId);
}
