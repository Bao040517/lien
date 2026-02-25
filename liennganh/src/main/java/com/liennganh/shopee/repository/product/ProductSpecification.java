package com.liennganh.shopee.repository.product;

import com.liennganh.shopee.entity.Product;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;
import jakarta.persistence.criteria.Predicate;

public class ProductSpecification {

    public static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, cb) -> categoryId == null ? cb.conjunction()
                : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) return cb.conjunction();
            if (minPrice != null && maxPrice != null) return cb.between(root.get("price"), minPrice, maxPrice);
            if (minPrice != null) return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    public static Specification<Product> nameContains(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) return cb.conjunction();
            String pattern = "%" + keyword.toLowerCase() + "%";
            Predicate productNameMatch = cb.like(cb.lower(root.get("name")), pattern);
            Predicate shopNameMatch = cb.like(cb.lower(root.get("shop").get("name")), pattern);
            return cb.or(productNameMatch, shopNameMatch);
        };
    }

    public static Specification<Product> hasStatus(String status) {
        return (root, query, cb) -> status == null ? cb.conjunction()
                : cb.equal(root.get("productStatus"), status);
    }

    public static Specification<Product> isApprovedStatus() {
        return (root, query, cb) -> cb.equal(root.get("productStatus"), "APPROVED");
    }

    public static Specification<Product> hasRatingGreaterThan(Double minRating) {
        return (root, query, cb) -> minRating == null ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("averageRating"), minRating);
    }
}
