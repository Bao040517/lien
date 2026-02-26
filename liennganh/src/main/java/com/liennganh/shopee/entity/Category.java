package com.liennganh.shopee.entity;

import jakarta.persistence.*;
import lombok.Data;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import java.time.LocalDateTime;

/**
 * Entity đại diện cho Danh mục sản phẩm (Category)
 * Ví dụ: Điện thoại, Quần áo, Gia dụng...
 */
@Entity
@Data
@Table(name = "categories")
@SQLDelete(sql = "UPDATE categories SET deleted = true, deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted = false")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Tên danh mục

    @Column(columnDefinition = "TEXT")
    private String description; // Mô tả danh mục

    @Column
    private String imageUrl; // URL ảnh đại diện danh mục

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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
