package com.liennganh.shopee.service;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.model.*;
import com.liennganh.shopee.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public List<Review> getShopReviews(Long shopId) {
        return reviewRepository.findByProductShopId(shopId);
    }

    public Double getProductAverageRating(Long productId) {
        return reviewRepository.getAverageRatingByProductId(productId);
    }

    public Double getShopAverageRating(Long shopId) {
        return reviewRepository.getAverageRatingByShopId(shopId);
    }

    @Transactional
    public Review addReview(Long userId, Long orderId, Long productId, int rating, String comment) {
        // 1. Verify User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Verify Order exists and belongs to User
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized order access");
        }

        // 3. Verify Order is completed (Only allow review for completed orders)
        // Ideally we check if status is DELIVERED/COMPLETED. For now let's assume if
        // it's not PENDING/CANCELLED
        if (order.getStatus() == Order.OrderStatus.PENDING || order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
        }

        // 4. Verify Product is in the Order
        boolean productInOrder = order.getOrderItems().stream()
                .anyMatch(item -> item.getProduct().getId().equals(productId));

        if (!productInOrder) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        Review review = new Review();
        review.setUser(user);
        review.setOrder(order);
        review.setProduct(product);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }
}
