package com.liennganh.shopee.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import java.time.LocalDateTime;

/**
 * Entity đại diện cho Biến thể sản phẩm (Variant / SKU)
 * Là sự kết hợp cụ thể của các options. Ví dụ: Áo phông (Product) -> Màu Đỏ +
 * Size M (Variant)
 */
@Entity
@Data
@Table(name = "product_variants")
@SQLDelete(sql = "UPDATE product_variants SET deleted = true, deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted = false")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({ "variants", "attributes" })
    private Product product;

    // Chuỗi JSON lưu tổ hợp lựa chọn: {"Size":"M", "Màu sắc":"Đen"}
    // Giúp dễ dàng truy vấn và hiển thị mà không cần join quá nhiều bảng
    @Column(columnDefinition = "TEXT")
    private String attributes;

    @Column(nullable = false)
    private BigDecimal price; // Giá bán riêng cho biến thể này

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity; // Tồn kho riêng cho biến thể này

    @Column(name = "image_url")
    private String imageUrl; // Ảnh riêng cho biến thể này

    // Soft Delete
    @Column(name = "deleted", columnDefinition = "boolean default false")
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getAttributes() {
        return attributes;
    }

    public void setAttributes(String attributes) {
        this.attributes = attributes;
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
}
