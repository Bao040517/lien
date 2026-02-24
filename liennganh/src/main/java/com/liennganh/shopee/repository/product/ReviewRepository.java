package com.liennganh.shopee.repository.product;

import com.liennganh.shopee.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository quản lý đánh giá sản phẩm (Review)
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    /**
     * Lấy danh sách đánh giá của một sản phẩm
     */
    List<Review> findByProductId(Long productId);

    /**
     * Lấy danh sách đánh giá của tất cả sản phẩm thuộc Shop
     */
    List<Review> findByProductShopId(Long shopId);

    /**
     * Tính điểm trung bình (rating) của một sản phẩm
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(Long productId);

    /**
     * Tính điểm trung bình của toàn bộ Shop
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.shop.id = :shopId")
    Double getAverageRatingByShopId(Long shopId);

    /**
     * Lấy danh sách đánh giá do user viết
     */
    List<Review> findByUserId(Long userId);

    /**
     * Xóa tất cả review của sản phẩm (dùng khi xóa sản phẩm)
     */
    void deleteByProductId(Long productId);
}
