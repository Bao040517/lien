package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.model.Review;
import com.liennganh.shopee.service.ReviewService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ApiResponse<List<Review>> getAllReviews() {
        return ApiResponse.success(reviewService.getAllReviews(), "All reviews retrieved successfully");
    }

    @GetMapping("/product/{productId}")
    public ApiResponse<List<Review>> getProductReviews(@PathVariable Long productId) {
        return ApiResponse.success(reviewService.getProductReviews(productId), "Reviews retrieved successfully");
    }

    @GetMapping("/shop/{shopId}")
    public ApiResponse<List<Review>> getShopReviews(@PathVariable Long shopId) {
        return ApiResponse.success(reviewService.getShopReviews(shopId), "Shop reviews retrieved successfully");
    }

    @GetMapping("/product/{productId}/rating")
    public ApiResponse<Double> getProductRating(@PathVariable Long productId) {
        return ApiResponse.success(reviewService.getProductAverageRating(productId),
                "Product rating retrieved successfully");
    }

    @GetMapping("/shop/{shopId}/rating")
    public ApiResponse<Double> getShopRating(@PathVariable Long shopId) {
        return ApiResponse.success(reviewService.getShopAverageRating(shopId), "Shop rating retrieved successfully");
    }

    @PostMapping
    public ApiResponse<Review> addReview(@RequestBody ReviewRequest request) {
        return ApiResponse.success(reviewService.addReview(request.getUserId(), request.getOrderId(),
                request.getProductId(), request.getRating(), request.getComment()), "Review added successfully");
    }

    @Data
    public static class ReviewRequest {
        private Long userId;
        private Long orderId;
        private Long productId;
        private int rating;
        private String comment;
    }
}
