package com.liennganh.shopee.controller.review;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Review;
import com.liennganh.shopee.service.product.ReviewService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

/**
 * Controller quản lý đánh giá sản phẩm (reviews/feedback)
 * Cho phép người mua đánh giá sản phẩm đã mua, kèm theo bình luận và hình ảnh
 */
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    /**
     * Lấy tất cả đánh giá trên hệ thống
     * Quyền hạn: Public
     * 
     */
    @GetMapping
    public ApiResponse<List<Review>> getAllReviews() {
        return ApiResponse.success(reviewService.getAllReviews(), "Lấy danh sách đánh giá thành công");
    }

    /**
     * Lấy danh sách đánh giá của một sản phẩm
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/product/{productId}")
    public ApiResponse<List<Review>> getProductReviews(@PathVariable Long productId) {
        return ApiResponse.success(reviewService.getProductReviews(productId), "Lấy đánh giá sản phẩm thành công");
    }

    /**
     * Lấy danh sách đánh giá của một shop
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/shop/{shopId}")
    public ApiResponse<List<Review>> getShopReviews(@PathVariable Long shopId) {
        return ApiResponse.success(reviewService.getShopReviews(shopId), "Lấy đánh giá shop thành công");
    }

    /**
     * Lấy điểm đánh giá trung bình của sản phẩm
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/product/{productId}/rating")
    public ApiResponse<Double> getProductRating(@PathVariable Long productId) {
        return ApiResponse.success(reviewService.getProductAverageRating(productId),
                "Lấy điểm đánh giá sản phẩm thành công");
    }

    /**
     * Lấy điểm đánh giá trung bình của shop
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/shop/{shopId}/rating")
    public ApiResponse<Double> getShopRating(@PathVariable Long shopId) {
        return ApiResponse.success(reviewService.getShopAverageRating(shopId), "Lấy điểm đánh giá shop thành công");
    }

    /**
     * Thêm đánh giá mới (chỉ text, không có ảnh)
     * Quyền hạn: USER, SELLER (đã mua hàng)
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @PostMapping
    public ApiResponse<Review> addReview(@RequestBody ReviewRequest request) {
        return ApiResponse.success(reviewService.addReview(request.getUserId(), request.getOrderId(),
                request.getProductId(), request.getRating(), request.getComment()), "Thêm đánh giá thành công");
    }

    /**
     * Thêm đánh giá kèm ảnh (tối đa 5 ảnh)
     * Quyền hạn: USER, SELLER (đã mua hàng)
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @PostMapping("/with-images")
    public ApiResponse<Review> addReviewWithImages(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam(required = false) Long orderId,
            @RequestParam int rating,
            @RequestParam(required = false) String comment,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {
        return ApiResponse.success(reviewService.addReviewWithImages(userId, orderId, productId,
                rating, comment, images), "Thêm đánh giá kèm ảnh thành công");
    }

    @Data
    public static class ReviewRequest {
        private Long userId;
        private Long orderId;
        private Long productId;
        private int rating;
        private String comment;
        private List<String> imageUrls;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Long getOrderId() {
            return orderId;
        }

        public void setOrderId(Long orderId) {
            this.orderId = orderId;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public int getRating() {
            return rating;
        }

        public void setRating(int rating) {
            this.rating = rating;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public List<String> getImageUrls() {
            return imageUrls;
        }

        public void setImageUrls(List<String> imageUrls) {
            this.imageUrls = imageUrls;
        }
    }
}

