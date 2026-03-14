package com.liennganh.shopee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO thống kê dành cho Người bán (Seller)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerStatisticsDTO {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalProducts;
    private Long totalSold;
    private Long totalFeedback;
    private Double returnRate;
    private Double averageRating;

    private Long pendingOrders;
    private Long shippingOrders;
    private Long deliveringOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;

    private List<TopProductDTO> topProducts;
    private List<ProductDetailStatsDTO> productDetailStats;
    private List<ChartDataDTO> revenueChart;
    private List<ChartDataDTO> ordersChart;

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public Long getShippingOrders() {
        return shippingOrders;
    }

    public void setShippingOrders(Long shippingOrders) {
        this.shippingOrders = shippingOrders;
    }

    public Long getDeliveringOrders() {
        return deliveringOrders;
    }

    public void setDeliveringOrders(Long deliveringOrders) {
        this.deliveringOrders = deliveringOrders;
    }

    public Long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(Long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public Long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(Long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public List<TopProductDTO> getTopProducts() {
        return topProducts;
    }

    public void setTopProducts(List<TopProductDTO> topProducts) {
        this.topProducts = topProducts;
    }

    public List<ChartDataDTO> getRevenueChart() {
        return revenueChart;
    }

    public void setRevenueChart(List<ChartDataDTO> revenueChart) {
        this.revenueChart = revenueChart;
    }

    public List<ChartDataDTO> getOrdersChart() {
        return ordersChart;
    }

    public void setOrdersChart(List<ChartDataDTO> ordersChart) {
        this.ordersChart = ordersChart;
    }

    public Long getTotalSold() {
        return totalSold;
    }

    public void setTotalSold(Long totalSold) {
        this.totalSold = totalSold;
    }

    public Long getTotalFeedback() {
        return totalFeedback;
    }

    public void setTotalFeedback(Long totalFeedback) {
        this.totalFeedback = totalFeedback;
    }

    public Double getReturnRate() {
        return returnRate;
    }

    public void setReturnRate(Double returnRate) {
        this.returnRate = returnRate;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public List<ProductDetailStatsDTO> getProductDetailStats() {
        return productDetailStats;
    }

    public void setProductDetailStats(List<ProductDetailStatsDTO> productDetailStats) {
        this.productDetailStats = productDetailStats;
    }
}
