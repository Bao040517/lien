package com.liennganh.shopee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * DTO thống kê dành cho Admin
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatisticsDTO {
    private Long totalUsers; // Tổng số người dùng
    private Long totalSellers; // Tổng số người bán
    private Long totalProducts; // Tổng số sản phẩm
    private Long totalOrders; // Tổng số đơn hàng
    private BigDecimal totalRevenue; // Tổng doanh thu hệ thống

    // Thống kê người bán theo trạng thái
    private Long pendingSellers;
    private Long approvedSellers;
    private Long rejectedSellers;
    private Long suspendedSellers;

    // Thống kê đơn hàng theo trạng thái
    private Map<String, Long> ordersByStatus;

    // Top người bán và sản phẩm bán chạy
    private List<TopSellerDTO> topSellers;
    private List<TopProductDTO> topProducts;

    // Dữ liệu biểu đồ (Chart Data)
    // Dữ liệu biểu đồ (Chart Data)
    private List<ChartDataDTO> revenueChart; // Biểu đồ doanh thu
    private List<ChartDataDTO> ordersChart; // Biểu đồ đơn hàng

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalSellers() {
        return totalSellers;
    }

    public void setTotalSellers(Long totalSellers) {
        this.totalSellers = totalSellers;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Long getPendingSellers() {
        return pendingSellers;
    }

    public void setPendingSellers(Long pendingSellers) {
        this.pendingSellers = pendingSellers;
    }

    public Long getApprovedSellers() {
        return approvedSellers;
    }

    public void setApprovedSellers(Long approvedSellers) {
        this.approvedSellers = approvedSellers;
    }

    public Long getRejectedSellers() {
        return rejectedSellers;
    }

    public void setRejectedSellers(Long rejectedSellers) {
        this.rejectedSellers = rejectedSellers;
    }

    public Long getSuspendedSellers() {
        return suspendedSellers;
    }

    public void setSuspendedSellers(Long suspendedSellers) {
        this.suspendedSellers = suspendedSellers;
    }

    public Map<String, Long> getOrdersByStatus() {
        return ordersByStatus;
    }

    public void setOrdersByStatus(Map<String, Long> ordersByStatus) {
        this.ordersByStatus = ordersByStatus;
    }

    public List<TopSellerDTO> getTopSellers() {
        return topSellers;
    }

    public void setTopSellers(List<TopSellerDTO> topSellers) {
        this.topSellers = topSellers;
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
