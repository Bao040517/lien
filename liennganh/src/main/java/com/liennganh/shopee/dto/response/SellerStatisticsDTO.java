package com.liennganh.shopee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerStatisticsDTO {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalProducts;
    private Long pendingOrders;
    private Long shippingOrders;
    private Long deliveringOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    private List<TopProductDTO> topProducts;
}
