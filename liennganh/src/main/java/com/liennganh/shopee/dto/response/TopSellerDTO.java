package com.liennganh.shopee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO thông tin người bán xuất sắc (Top Seller)
 */
@NoArgsConstructor
public class TopSellerDTO {
    private Long sellerId; // ID người bán
    private String shopName; // Tên shop
    private Long totalOrders; // Tổng số đơn hàng
    private BigDecimal revenue; // Tổng doanh thu

    public TopSellerDTO(Long sellerId, String shopName, Long totalOrders, BigDecimal revenue) {
        this.sellerId = sellerId;
        this.shopName = shopName;
        this.totalOrders = totalOrders;
        this.revenue = revenue;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }
}
