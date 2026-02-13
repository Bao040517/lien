package com.liennganh.shopee.repository;

import com.liennganh.shopee.model.ProductAttributeOption;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductAttributeOptionRepository extends JpaRepository<ProductAttributeOption, Long> {
    List<ProductAttributeOption> findByAttributeId(Long attributeId);
}
