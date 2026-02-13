package com.liennganh.shopee.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String recipientName;
    private String phoneNumber;
    private String street;
    private String city;
    private String district;
    private String ward;

    @Column(name = "is_default")
    private boolean isDefault = false;
}
