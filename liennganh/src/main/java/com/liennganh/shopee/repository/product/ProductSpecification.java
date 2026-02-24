package com.liennganh.shopee.repository.product;

import com.liennganh.shopee.entity.Product;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

/**
 * Cung cấp các Specifications để lọc sản phẩm linh động
 */
public class ProductSpecification {

    /**
     * Lọc theo danh mục
     */
    public static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, criteriaBuilder) -> categoryId == null ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("category").get("id"), categoryId);
    }

    /**
     * Lọc theo khoảng giá
     */
    public static Specification<Product> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null)
                return criteriaBuilder.conjunction();
            if (minPrice != null && maxPrice != null)
                return criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
            if (minPrice != null)
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    /**
     * Tìm kiếm theo tên (gần đúng)
     */
    public static Specification<Product> nameContains(String keyword) {
        return (root, query, criteriaBuilder) -> keyword == null ? criteriaBuilder.conjunction()
                : criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
    }

    /**
     * Lọc sản phẩm chưa bị khóa
     */
    public static Specification<Product> isNotBanned() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isFalse(root.get("isBanned"));
    }

    /**
     * Lọc theo đánh giá tối thiểu (ví dụ: trên 4 sao)
     */
    public static Specification<Product> hasRatingGreaterThan(Double minRating) {
        return (root, query, criteriaBuilder) -> minRating == null ? criteriaBuilder.conjunction()
                : criteriaBuilder.greaterThanOrEqualTo(root.get("averageRating"), minRating);
    }
}
