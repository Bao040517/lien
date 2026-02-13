package com.liennganh.shopee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopSellerDTO {
    private Long sellerId;
    private String shopName;
    private Long totalOrders;
    private BigDecimal revenue;
}
