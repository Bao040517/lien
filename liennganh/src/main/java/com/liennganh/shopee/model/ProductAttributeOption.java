package com.liennganh.shopee.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
    private String value; // VD: "S", "M", "L", "Đen", "8G+256G"

    @Column(name = "image_url")
    private String imageUrl; // Ảnh minh hoạ cho option (tuỳ chọn)
}
