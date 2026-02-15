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

        Order order;

        if (orderId != null) {
            // 2a. Verify specific Order
            order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

            if (order.getUser() == null || !order.getUser().getId().equals(userId)) {
                throw new RuntimeException("Unauthorized order access");
            }

            // 3a. Verify Order status (Must be DELIVERED)
            if (order.getStatus() != Order.OrderStatus.DELIVERED) {
                throw new RuntimeException("Bạn chỉ có thể đánh giá khi đơn hàng đã giao thành công (DELIVERED)!");
            }

            // 4a. Verify Product is in the Order
            boolean productInOrder = order.getOrderItems().stream()
                    .anyMatch(item -> item.getProduct() != null && item.getProduct().getId().equals(productId));

            if (!productInOrder) {
                throw new RuntimeException("Sản phẩm không có trong đơn hàng này!");
            }
        } else {
            // 2b. Automatically find latest valid order
            order = orderRepository.findFirstByUserIdAndOrderItemsProductIdAndStatusOrderByCreatedAtDesc(
                    userId, productId, Order.OrderStatus.DELIVERED)
                    .orElseThrow(() -> new RuntimeException("Bạn chưa mua sản phẩm này hoặc chưa nhận được hàng!"));
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
