package com.liennganh.shopee.repository;

import com.liennganh.shopee.model.Product;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;

public class ProductSpecification {

    public static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, criteriaBuilder) -> categoryId == null ? null
                : criteriaBuilder.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null)
                return null;
            if (minPrice != null && maxPrice != null)
                return criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
            if (minPrice != null)
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    public static Specification<Product> nameContains(String keyword) {
        return (root, query, criteriaBuilder) -> keyword == null ? null
                : criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
    }
}
