package com.liennganh.shopee.dto.response;

import java.math.BigDecimal;

/**
 * DTO thống kê chi tiết từng sản phẩm cho Seller Dashboard
 * Tất cả dữ liệu được tính từ bảng Order/OrderItem/Review
 */
public class ProductDetailStatsDTO {
    private Long productId;
    private String productName;
    private String imageUrl;
    private BigDecimal price;
    private Integer stockQuantity;
    private Long sold; // Tính từ OrderItem (đơn DELIVERED)
    private Long reviewCount; // Tính từ Review
    private Double averageRating; // Tính từ Review

    public ProductDetailStatsDTO() {
    }

    public ProductDetailStatsDTO(Long productId, String productName, String imageUrl,
            BigDecimal price, Integer stockQuantity, Long sold, Long reviewCount, Double averageRating) {
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.sold = sold;
        this.reviewCount = reviewCount;
        this.averageRating = averageRating;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Long getSold() {
        return sold;
    }

    public void setSold(Long sold) {
        this.sold = sold;
    }

    public Long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
}
