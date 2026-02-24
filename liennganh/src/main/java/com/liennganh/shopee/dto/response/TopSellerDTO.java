package com.liennganh.shopee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopSellerDTO {
    private Long shopId;
    private String shopName;
    private String logoUrl;
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Double averageRating;
    private Double returnRate;
    private LocalDateTime joinDate;
}
