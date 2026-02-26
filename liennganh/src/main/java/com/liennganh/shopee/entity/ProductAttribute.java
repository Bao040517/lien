package com.liennganh.shopee.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.BatchSize;
import java.util.List;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import java.time.LocalDateTime;

/**
 * Entity định nghĩa Thuộc tính sản phẩm
 * Một sản phẩm có thể có nhiều thuộc tính (Size, Màu sắc...)
 */
@Entity
@Data
@Table(name = "product_attributes")
@SQLDelete(sql = "UPDATE product_attributes SET deleted = true, deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted = false")
public class ProductAttribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({ "attributes", "variants" })
    private Product product;

    @Column(nullable = false)
    private String name; // Tên thuộc tính. VD: "Size", "Màu sắc"

    @OneToMany(mappedBy = "attribute", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 50)
    private List<ProductAttributeOption> options; // Danh sách giá trị của thuộc tính (VD: S, M, L)

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ProductAttributeOption> getOptions() {
        return options;
    }

    public void setOptions(List<ProductAttributeOption> options) {
        this.options = options;
    }
}
