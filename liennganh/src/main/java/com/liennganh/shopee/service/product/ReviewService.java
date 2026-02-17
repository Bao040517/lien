package com.liennganh.shopee.service.product;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.*;
import com.liennganh.shopee.repository.product.ReviewRepository;
import com.liennganh.shopee.repository.order.OrderRepository;
import com.liennganh.shopee.repository.product.ProductRepository;
import com.liennganh.shopee.repository.user.UserRepository;
import com.liennganh.shopee.service.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service quản lý đánh giá sản phẩm (Review)
 */
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

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.liennganh.shopee.service.common.FileStorageService fileStorageService;

    /**
     * Lấy tất cả đánh giá (Admin)
     */
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    /**
     * Lấy đánh giá của một sản phẩm
     */
    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    /**
     * Lấy đánh giá của một Shop (dựa trên sản phẩm của shop đó)
     */
    public List<Review> getShopReviews(Long shopId) {
        return reviewRepository.findByProductShopId(shopId);
    }

    /**
     * Lấy điểm đánh giá trung bình của sản phẩm
     */
    public Double getProductAverageRating(Long productId) {
        return reviewRepository.getAverageRatingByProductId(productId);
    }

    /**
     * Lấy điểm đánh giá trung bình của Shop
     */
    public Double getShopAverageRating(Long shopId) {
        return reviewRepository.getAverageRatingByShopId(shopId);
    }

    /**
     * Thêm đánh giá mới (Review)
     * Yêu cầu: User phải mua sản phẩm và đơn hàng đã giao thành công
     * 
     * @throws AppException USER_NOT_FOUND, ORDER_NOT_FOUND, NOT_ORDER_OWNER,
     *                      ORDER_NOT_DELIVERED
     */
    @Transactional
    public Review addReview(Long userId, Long orderId, Long productId, int rating, String comment) {
        // 1. Xác thực User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Order order;

        if (orderId != null) {
            // 2a. Xác thực đơn hàng cụ thể
            order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

            if (order.getUser() == null || !order.getUser().getId().equals(userId)) {
                throw new AppException(ErrorCode.NOT_ORDER_OWNER);
            }

            // 3a. Kiểm tra trạng thái đơn hàng (Phải là DELIVERED)
            if (order.getStatus() != Order.OrderStatus.DELIVERED) {
                throw new AppException(ErrorCode.ORDER_NOT_DELIVERED);
            }

            // 4a. Kiểm tra sản phẩm có trong đơn hàng không
            boolean productInOrder = order.getOrderItems().stream()
                    .anyMatch(item -> item.getProduct() != null && item.getProduct().getId().equals(productId));

            if (!productInOrder) {
                throw new AppException(ErrorCode.INVALID_PRODUCT_DATA);
            }
        } else {
            // 2b. Tự động tìm đơn hàng hợp lệ gần nhất đã giao
            order = orderRepository.findFirstByUserIdAndOrderItemsProductIdAndStatusOrderByCreatedAtDesc(
                    userId, productId, Order.OrderStatus.DELIVERED)
                    .orElseThrow(() -> new AppException(ErrorCode.CANNOT_REVIEW_PRODUCT));
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

        Review savedReview = reviewRepository.save(review);

        // --- Cập nhật điểm đánh giá trung bình cho sản phẩm ---
        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        Long reviewCount = (long) reviewRepository.findByProductId(productId).size();

        product.setAverageRating(avgRating != null ? avgRating : 0.0);
        product.setReviewCount(reviewCount);
        productRepository.save(product);

        // Thông báo cho Seller
        if (product.getShop() != null && product.getShop().getOwner() != null) {
            if (!product.getShop().getOwner().getId().equals(user.getId())) {
                notificationService.createNotification(
                        product.getShop().getOwner(),
                        "Đánh giá mới: " + product.getName(),
                        user.getUsername() + " đã đánh giá " + rating + " sao cho sản phẩm của bạn.",
                        Notification.NotificationType.REVIEW,
                        savedReview.getId());
            }
        }

        return savedReview;
    }

    /**
     * Thêm đánh giá kèm ảnh
     * 
     */
    @Transactional
    public Review addReviewWithImages(Long userId, Long orderId, Long productId, int rating,
            String comment, org.springframework.web.multipart.MultipartFile[] imageFiles) {
        // Tạo review cơ bản trước
        Review review = addReview(userId, orderId, productId, rating, comment);

        // Upload ảnh nếu có (tối đa 5 ảnh)
        if (imageFiles != null && imageFiles.length > 0) {
            List<String> imageUrls = new java.util.ArrayList<>();
            int maxImages = Math.min(imageFiles.length, 5); // Giới hạn 5 ảnh

            for (int i = 0; i < maxImages; i++) {
                org.springframework.web.multipart.MultipartFile file = imageFiles[i];
                if (!file.isEmpty()) {
                    try {
                        // Sử dụng FileStorageService để upload
                        String fileName = fileStorageService.storeFile(file);
                        String fileUrl = org.springframework.web.servlet.support.ServletUriComponentsBuilder
                                .fromCurrentContextPath()
                                .path("/api/files/")
                                .path(fileName)
                                .toUriString();
                        imageUrls.add(fileUrl);
                    } catch (Exception e) {
                        // Log lỗi nhưng không fail toàn bộ review
                        System.err.println("Error uploading image: " + e.getMessage());
                    }
                }
            }

            review.setImages(imageUrls);
            review = reviewRepository.save(review); // Lưu lại với danh sách ảnh
        }

        return review;
    }
}
