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
    private BigDecimal totalRevenue; // Tổng doanh thu
    private Long totalOrders; // Tổng số đơn hàng
    private Long totalProducts; // Tổng số sản phẩm

    // Thống kê đơn hàng theo trạng thái
    private Long pendingOrders; // Đơn chờ xác nhận
    private Long shippingOrders; // Đơn đang vận chuyển
    private Long deliveringOrders; // Đơn đang giao
    private Long deliveredOrders; // Đơn đã giao thành công
    private Long cancelledOrders; // Đơn đã hủy

    private List<TopProductDTO> topProducts; // Top sản phẩm bán chạy của shop

    // Dữ liệu biểu đồ
    private List<ChartDataDTO> revenueChart; // Biểu đồ doanh thu
    private List<ChartDataDTO> ordersChart; // Biểu đồ đơn hàng

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
}
