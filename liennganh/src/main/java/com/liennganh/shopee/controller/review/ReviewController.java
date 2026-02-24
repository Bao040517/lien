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
 * Controller quáº£n lÃ½ Ä‘Ã¡nh giÃ¡ sáº£n pháº©m (reviews/feedback)
 * Cho phÃ©p ngÆ°á»i mua Ä‘Ã¡nh giÃ¡ sáº£n pháº©m Ä‘Ã£ mua, kÃ¨m theo bÃ¬nh luáº­n vÃ  hÃ¬nh áº£nh
 */
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    /**
     * Láº¥y táº¥t cáº£ Ä‘Ã¡nh giÃ¡ trÃªn há»‡ thá»‘ng
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping
    public ApiResponse<List<Review>> getAllReviews() {
        return ApiResponse.success(reviewService.getAllReviews(), "Láº¥y danh sÃ¡ch Ä‘Ã¡nh giÃ¡ thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y danh sÃ¡ch Ä‘Ã¡nh giÃ¡ cá»§a má»™t sáº£n pháº©m
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/product/{productId}")
    public ApiResponse<List<Review>> getProductReviews(@PathVariable Long productId) {
        return ApiResponse.success(reviewService.getProductReviews(productId), "Láº¥y Ä‘Ã¡nh giÃ¡ sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y danh sÃ¡ch Ä‘Ã¡nh giÃ¡ cá»§a má»™t shop
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/shop/{shopId}")
    public ApiResponse<List<Review>> getShopReviews(@PathVariable Long shopId) {
        return ApiResponse.success(reviewService.getShopReviews(shopId), "Láº¥y Ä‘Ã¡nh giÃ¡ shop thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y Ä‘iá»ƒm Ä‘Ã¡nh giÃ¡ trung bÃ¬nh cá»§a sáº£n pháº©m
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/product/{productId}/rating")
    public ApiResponse<Double> getProductRating(@PathVariable Long productId) {
        return ApiResponse.success(reviewService.getProductAverageRating(productId),
                "Láº¥y Ä‘iá»ƒm Ä‘Ã¡nh giÃ¡ sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y Ä‘iá»ƒm Ä‘Ã¡nh giÃ¡ trung bÃ¬nh cá»§a shop
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/shop/{shopId}/rating")
    public ApiResponse<Double> getShopRating(@PathVariable Long shopId) {
        return ApiResponse.success(reviewService.getShopAverageRating(shopId), "Láº¥y Ä‘iá»ƒm Ä‘Ã¡nh giÃ¡ shop thÃ nh cÃ´ng");
    }

    /**
     * ThÃªm Ä‘Ã¡nh giÃ¡ má»›i (chá»‰ text, khÃ´ng cÃ³ áº£nh)
     * Quyá»n háº¡n: USER, SELLER (Ä‘Ã£ mua hÃ ng)
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @PostMapping
    public ApiResponse<Review> addReview(@RequestBody ReviewRequest request) {
        return ApiResponse.success(reviewService.addReview(request.getUserId(), request.getOrderId(),
                request.getProductId(), request.getRating(), request.getComment()), "ThÃªm Ä‘Ã¡nh giÃ¡ thÃ nh cÃ´ng");
    }

    /**
     * ThÃªm Ä‘Ã¡nh giÃ¡ kÃ¨m áº£nh (tá»‘i Ä‘a 5 áº£nh)
     * Quyá»n háº¡n: USER, SELLER (Ä‘Ã£ mua hÃ ng)
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
                rating, comment, images), "ThÃªm Ä‘Ã¡nh giÃ¡ kÃ¨m áº£nh thÃ nh cÃ´ng");
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

