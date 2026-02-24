package com.liennganh.shopee.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.BatchSize;
import java.math.BigDecimal;
import java.util.List;

/**
 * Entity đại diện cho Sản phẩm (Product)
 */
@Entity
@Data
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop; // Shop bán sản phẩm này

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // Danh mục sản phẩm

    @Column(nullable = false)
    private String name; // Tên sản phẩm

    private String description; // Mô tả sản phẩm

    @Column(nullable = false)
    private BigDecimal price; // Giá bán cơ bản

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity; // Số lượng tồn kho

    @Column(name = "image_url")
    private String imageUrl; // URL ảnh đại diện

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    @BatchSize(size = 50)
    private List<String> images; // Danh sách ảnh sản phẩm (nhiều ảnh)

    private boolean isBanned = false; // Trạng thái cấm bán (Vi phạm chính sách)
    private String violationReason; // Lý do vi phạm

    public String getViolationReason() {
        return violationReason;
    }

    public void setViolationReason(String violationReason) {
        this.violationReason = violationReason;
    }

    // Thống kê bán hàng
    @Column(name = "sold", columnDefinition = "bigint default 0")
    private Long sold = 0L; // Số lượng đã bán

    // Thống kê đánh giá
    @Column(name = "average_rating", columnDefinition = "double precision default 0.0")
    private Double averageRating = 0.0; // Điểm đánh giá trung bình

    @Column(name = "review_count", columnDefinition = "bigint default 0")
    private Long reviewCount = 0L; // Tổng số lượt đánh giá

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("product")
    @BatchSize(size = 50)
    private List<ProductAttribute> attributes; // Danh sách thuộc tính (Size, Màu...)

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("product")
    @BatchSize(size = 50)
    private List<ProductVariant> variants; // Danh sách biến thể (SKU)

    public void setBanned(boolean banned) {
        isBanned = banned;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Shop getShop() {
        return shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public boolean isBanned() {
        return isBanned;
    }

    public Long getSold() {
        return sold;
    }

    public void setSold(Long sold) {
        this.sold = sold;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }

    public List<ProductAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<ProductAttribute> attributes) {
        this.attributes = attributes;
    }

    public List<ProductVariant> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariant> variants) {
        this.variants = variants;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }
}
