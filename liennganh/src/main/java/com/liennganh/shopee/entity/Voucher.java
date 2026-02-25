package com.liennganh.shopee.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity d?i di?n cho M� gi?m gi� (Voucher)
 */
@Entity
@Data
@Table(name = "vouchers")
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; // M� code (VD: SALE50)

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType; // Loại giảm giá: % hoặc tiền cố định

    @Column(name = "discount_value", nullable = false)
    private BigDecimal discountValue; // Giá trị giảm

    @Column(name = "min_order_value")
    private BigDecimal minOrderValue; // Giá trị đơn hàng tối thiểu để áp dụng

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate; // Ngày bắt đầu

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate; // Ngày kết thúc

    @Column(name = "usage_limit")
    private Integer usageLimit; // Số lượt sử dụng tối đa

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop; // Shop tạo voucher (Null nếu là voucher sàn/system)

    public enum DiscountType {
        PERCENTAGE, // Giảm theo phần trăm
        FIXED // Giảm số tiền cố định
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public DiscountType getDiscountType() {
        return discountType;
    }

    public void setDiscountType(DiscountType discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public BigDecimal getMinOrderValue() {
        return minOrderValue;
    }

    public void setMinOrderValue(BigDecimal minOrderValue) {
        this.minOrderValue = minOrderValue;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public Shop getShop() {
        return shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }
}
