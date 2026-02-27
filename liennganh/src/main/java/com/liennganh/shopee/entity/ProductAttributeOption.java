package com.liennganh.shopee.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import java.time.LocalDateTime;

/**
 * Entity định nghĩa Giá trị thuộc tính (Option)
 * Ví dụ: Thuộc tính "Màu sắc" có các Options: "Đỏ", "Xanh"
 */
@Entity
@Data
@Table(name = "product_attribute_options")
@SQLDelete(sql = "UPDATE product_attribute_options SET deleted = true, deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted = false")
public class ProductAttributeOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "attribute_id", nullable = false)
    @JsonIgnoreProperties({ "options", "product" })
    private ProductAttribute attribute;

    @Column(nullable = false)
    private String value; // Giá trị option (VD: "S", "M", "L", "Đen")

    @Column(name = "image_url")
    private String imageUrl; // Ảnh đại diện cho option (VD: Ảnh áo màu đỏ)

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

    public ProductAttribute getAttribute() {
        return attribute;
    }

    public void setAttribute(ProductAttribute attribute) {
        this.attribute = attribute;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
