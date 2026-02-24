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
    private Integer discountPercentage;
    private BigDecimal discountedPrice;
    private Boolean isBanned; // Sản phẩm có bị khóa không
    private String violationReason; // Lý do vi phạm

    public ProductDetailStatsDTO() {
    }

    public ProductDetailStatsDTO(Long productId, String productName, String imageUrl,
            BigDecimal price, Integer stockQuantity, Long sold, Long reviewCount, Double averageRating,
            Integer discountPercentage, BigDecimal discountedPrice) {
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.sold = sold;
        this.reviewCount = reviewCount;
        this.averageRating = averageRating;
        this.discountPercentage = discountPercentage;
        this.discountedPrice = discountedPrice;
    }

    public ProductDetailStatsDTO(Long productId, String productName, String imageUrl,
            BigDecimal price, Integer stockQuantity, Long sold, Long reviewCount, Double averageRating,
            Integer discountPercentage, BigDecimal discountedPrice,
            Boolean isBanned, String violationReason) {
        this(productId, productName, imageUrl, price, stockQuantity, sold, reviewCount, averageRating,
                discountPercentage, discountedPrice);
        this.isBanned = isBanned;
        this.violationReason = violationReason;
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

    public Integer getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public BigDecimal getDiscountedPrice() {
        return discountedPrice;
    }

    public void setDiscountedPrice(BigDecimal discountedPrice) {
        this.discountedPrice = discountedPrice;
    }

    public Boolean getIsBanned() {
        return isBanned;
    }

    public void setIsBanned(Boolean isBanned) {
        this.isBanned = isBanned;
    }

    public String getViolationReason() {
        return violationReason;
    }

    public void setViolationReason(String violationReason) {
        this.violationReason = violationReason;
    }
}
