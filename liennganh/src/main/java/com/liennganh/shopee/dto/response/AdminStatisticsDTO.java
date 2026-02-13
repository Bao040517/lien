package com.liennganh.shopee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatisticsDTO {
    private Long totalUsers;
    private Long totalSellers;
    private Long totalProducts;
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private Long pendingSellers;
    private Long approvedSellers;
    private Long rejectedSellers;
    private Long suspendedSellers;
    private Map<String, Long> ordersByStatus;
    private List<TopSellerDTO> topSellers;
    private List<TopProductDTO> topProducts;
}
