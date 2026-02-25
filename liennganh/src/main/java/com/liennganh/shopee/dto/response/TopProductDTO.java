package com.liennganh.shopee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO thông tin sản phẩm bán chạy (Top Product)
 */
@NoArgsConstructor
public class TopProductDTO {
    private Long productId; // ID sản phẩm
    private String productName; // Tên sản phẩm
    private Long totalSold; // T?ng s? lu?ng d� b�n
    private BigDecimal revenue; // Tổng doanh thu từ sản phẩm này

    public TopProductDTO(Long productId, String productName, Long totalSold, BigDecimal revenue) {
        this.productId = productId;
        this.productName = productName;
        this.totalSold = totalSold;
        this.revenue = revenue;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Long getTotalSold() {
        return totalSold;
    }

    public void setTotalSold(Long totalSold) {
        this.totalSold = totalSold;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }
}
