package com.liennganh.shopee.entity;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Entity đại diện cho Cửa hàng (Shop)
 * Mỗi User (Seller) chỉ được sở hữu 1 Shop
 */
@Entity
@Data
@Table(name = "shops")
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner; // Người sở hữu Shop

    @Column(nullable = false)
    private String name; // Tên Shop

    private String description; // Mô tả Shop

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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
