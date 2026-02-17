package com.liennganh.shopee.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Entity định nghĩa Giá trị thuộc tính (Option)
 * Ví dụ: Thuộc tính "Màu sắc" có các Options: "Đỏ", "Xanh"
 */
@Entity
@Data
@Table(name = "product_attribute_options")
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
